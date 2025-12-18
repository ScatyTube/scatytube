import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const isUpdating = useRef(false);

  const updateDbStatus = useCallback(async (isOnline: boolean) => {
    if (!user || isUpdating.current) return;
    
    isUpdating.current = true;
    try {
      await supabase
        .from("profiles")
        .update({ 
          is_online: isOnline, 
          last_seen: new Date().toISOString() 
        })
        .eq("id", user.id);
    } catch (error) {
      console.error("Failed to update online status:", error);
    } finally {
      isUpdating.current = false;
    }
  }, [user]);

  const setOfflineSync = useCallback(() => {
    if (!user) return;
    
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`;
    const data = JSON.stringify({ is_online: false, last_seen: new Date().toISOString() });
    
    // Try sendBeacon first, then fetch fallback
    const blob = new Blob([data], { type: 'application/json' });
    const sent = navigator.sendBeacon(url, blob);
    
    if (!sent) {
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: data,
        keepalive: true
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Set online immediately
    updateDbStatus(true);

    // Use Realtime Presence for reliable tracking
    const channel = supabase.channel(`presence_${user.id}`, {
      config: { presence: { key: user.id } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        if (Object.keys(state).length > 0) {
          updateDbStatus(true);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() });
        }
      });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateDbStatus(false);
      } else {
        updateDbStatus(true);
        channel.track({ user_id: user.id, online_at: new Date().toISOString() });
      }
    };

    const handleFocus = () => {
      updateDbStatus(true);
      channel.track({ user_id: user.id, online_at: new Date().toISOString() });
    };
    
    const handleBlur = () => updateDbStatus(false);
    const handleOnline = () => {
      updateDbStatus(true);
      channel.track({ user_id: user.id, online_at: new Date().toISOString() });
    };
    const handleOffline = () => updateDbStatus(false);
    const handleBeforeUnload = () => setOfflineSync();
    const handlePageHide = () => setOfflineSync();

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Heartbeat every 15 seconds
    const heartbeat = setInterval(() => {
      if (document.visibilityState === "visible" && document.hasFocus() && navigator.onLine) {
        updateDbStatus(true);
        channel.track({ user_id: user.id, online_at: new Date().toISOString() });
      }
    }, 15000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(heartbeat);
      channel.untrack();
      supabase.removeChannel(channel);
      updateDbStatus(false);
    };
  }, [user, updateDbStatus, setOfflineSync]);

  return { setOffline: () => updateDbStatus(false) };
};
