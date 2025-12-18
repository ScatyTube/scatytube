import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);
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

  // Sync fetch for beforeunload (most reliable)
  const setOfflineSync = useCallback(() => {
    if (!user) return;
    
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`;
    const data = JSON.stringify({ is_online: false, last_seen: new Date().toISOString() });
    
    // Try both sendBeacon and fetch for maximum reliability
    try {
      navigator.sendBeacon(
        url,
        new Blob([data], { type: 'application/json' })
      );
    } catch {
      // Fallback to fetch with keepalive
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
    const channel = supabase.channel(`user_presence_${user.id}`, {
      config: { presence: { key: user.id } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const isPresent = Object.keys(state).length > 0;
        if (isPresent) {
          updateDbStatus(true);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateDbStatus(false);
      } else if (document.visibilityState === "visible") {
        updateDbStatus(true);
        // Re-track presence when visible
        channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
        });
      }
    };

    // Focus handlers
    const handleFocus = () => {
      updateDbStatus(true);
      channel.track({
        user_id: user.id,
        online_at: new Date().toISOString(),
      });
    };
    
    const handleBlur = () => {
      updateDbStatus(false);
    };

    // Network status handlers
    const handleOnline = () => {
      updateDbStatus(true);
      channel.track({
        user_id: user.id,
        online_at: new Date().toISOString(),
      });
    };
    
    const handleOffline = () => {
      updateDbStatus(false);
    };

    // Page unload - most critical
    const handleBeforeUnload = () => {
      setOfflineSync();
    };

    const handlePageHide = () => {
      setOfflineSync();
    };

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
        channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
        });
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
      
      // Cleanup: untrack and unsubscribe
      channel.untrack();
      supabase.removeChannel(channel);
      updateDbStatus(false);
    };
  }, [user, updateDbStatus, setOfflineSync]);

  return { setOffline: () => updateDbStatus(false) };
};
