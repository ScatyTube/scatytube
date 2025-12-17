import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { useProfile, useSubscription, useToggleSubscription } from "@/hooks/useProfiles";
import { useVideos } from "@/hooks/useVideos";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Channel = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useProfile(id || "");
  const { data: videos, isLoading: videosLoading } = useVideos({ userId: id, limit: 50 });
  const { data: subscription } = useSubscription(user?.id || "", id || "");
  const toggleSubscription = useToggleSubscription();

  const handleSubscribe = () => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }
    if (!id) return;

    toggleSubscription.mutate({
      subscriberId: user.id,
      channelId: id,
      isSubscribed: !!subscription,
    });
  };

  if (profileLoading) {
    return (
      <Layout>
        <div className="max-w-[900px] mx-auto px-4 py-8 text-center">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-[900px] mx-auto px-4 py-8 text-center">
          Channel not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        {/* Channel Header */}
        <div className="border border-border rounded mb-4">
          <div className="box-header-2007">{profile.username}'s Channel</div>
          <div className="bg-card p-4">
            <div className="flex gap-4">
              <img
                src={profile.avatar_url || "https://picsum.photos/seed/avatar/100/100"}
                alt={profile.username}
                className="w-24 h-24 rounded border border-border"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-[16px]">{profile.username}</h1>
                  {profile.is_online ? (
                    <span className="text-[10px] font-bold px-1 border border-[#006600] bg-gradient-to-b from-[#99ff99] to-[#66cc66] text-[#006600]">
                      ● Online Now!
                    </span>
                  ) : (
                    <span className="text-[10px] px-1 border border-[#999999] bg-gradient-to-b from-[#e0e0e0] to-[#c0c0c0] text-[#666666]">
                      ○ Offline
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {profile.subscribers_count || 0} subscribers
                </p>
                {profile.last_seen && !profile.is_online && (
                  <p className="text-[10px] text-muted-foreground">
                    Last seen: {new Date(profile.last_seen).toLocaleString()}
                  </p>
                )}
                <p className="text-[11px] mt-2">{profile.bio || "No bio yet."}</p>
                {user && user.id !== id && (
                  <button
                    onClick={handleSubscribe}
                    className={`mt-2 ${subscription ? "btn-2007" : "btn-2007-blue"}`}
                  >
                    {subscription ? "Unsubscribe" : "Subscribe"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="border border-border rounded">
          <div className="box-header-2007">Videos ({videos?.length || 0})</div>
          <div className="bg-card">
            {videosLoading ? (
              <div className="p-4 text-center text-[11px] text-muted-foreground">
                Loading videos...
              </div>
            ) : videos && videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail_url={video.thumbnail_url}
                  views_count={video.views_count}
                  author={profile.username}
                  rating={video.rating}
                />
              ))
            ) : (
              <div className="p-4 text-center text-[11px] text-muted-foreground">
                No videos yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Channel;
