import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const isUpdating = useRef(false);

  const updateOnlineStatus = useCallback(async (isOnline: boolean) => {
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

  // Set offline using fetch with auth (for beforeunload)
  const setOfflineSync = useCallback(() => {
    if (!user) return;
    
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`;
    const data = JSON.stringify({ is_online: false, last_seen: new Date().toISOString() });
    
    // Use fetch with keepalive for more reliable offline status
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
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Set online immediately when user is available
    updateOnlineStatus(true);

    const handleBeforeUnload = () => {
      setOfflineSync();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateOnlineStatus(false);
      } else if (document.visibilityState === "visible") {
        updateOnlineStatus(true);
      }
    };

    // Handle focus/blur for better detection
    const handleFocus = () => updateOnlineStatus(true);
    const handleBlur = () => updateOnlineStatus(false);

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Heartbeat every 20 seconds to keep status fresh
    const heartbeat = setInterval(() => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        updateOnlineStatus(true);
      }
    }, 20000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      clearInterval(heartbeat);
      // Set offline on cleanup
      updateOnlineStatus(false);
    };
  }, [user, updateOnlineStatus, setOfflineSync]);

  return { setOffline: () => updateOnlineStatus(false) };
};
