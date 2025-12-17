import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useOnlineStatus = () => {
  const { user } = useAuth();

  const updateOnlineStatus = useCallback(async (isOnline: boolean) => {
    if (!user) return;
    
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
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Set online when component mounts
    updateOnlineStatus(true);

    // Set offline when window closes or user navigates away
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable offline status update
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`;
      const data = JSON.stringify({ is_online: false, last_seen: new Date().toISOString() });
      
      navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateOnlineStatus(false);
      } else if (document.visibilityState === "visible") {
        updateOnlineStatus(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Heartbeat to keep online status fresh (every 30 seconds)
    const heartbeat = setInterval(() => {
      if (document.visibilityState === "visible") {
        updateOnlineStatus(true);
      }
    }, 30000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(heartbeat);
      updateOnlineStatus(false);
    };
  }, [user, updateOnlineStatus]);
};
