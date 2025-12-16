import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfiles";
import { useVideos, useFavoriteVideos } from "@/hooks/useVideos";
import { toast } from "sonner";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"videos" | "favorites" | "settings">("videos");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id || "");
  const { data: videos } = useVideos({ userId: user?.id, limit: 50 });
  const { data: favorites } = useFavoriteVideos(user?.id || "");
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateProfile.mutate(
      { userId: user.id, updates: { username, bio } },
      {
        onSuccess: () => {
          toast.success("Profile updated!");
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      }
    );
  };

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="max-w-[900px] mx-auto px-4 py-8 text-center">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        {/* Profile Header */}
        <div className="border border-border rounded mb-4">
          <div className="box-header-2007">My Account</div>
          <div className="bg-card p-4">
            <div className="flex gap-4">
              <img
                src={profile.avatar_url || "https://picsum.photos/seed/avatar/100/100"}
                alt={profile.username}
                className="w-24 h-24 rounded border border-border"
              />
              <div className="flex-1">
                <h1 className="font-bold text-[16px]">{profile.username}</h1>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {profile.subscribers_count || 0} subscribers
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Member since: {new Date(profile.created_at || "").toLocaleDateString()}
                </p>
                <Link to={`/channel/${user.id}`} className="btn-2007 inline-block mt-2">
                  View My Channel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {[
            { key: "videos", label: "My Videos" },
            { key: "favorites", label: "Favorites" },
            { key: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-3 py-1 text-[11px] border border-border rounded-t ${
                activeTab === tab.key
                  ? "bg-card border-b-card font-bold"
                  : "bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="border border-border rounded">
          {activeTab === "videos" && (
            <>
              <div className="box-header-2007">My Videos ({videos?.length || 0})</div>
              <div className="bg-card">
                {videos && videos.length > 0 ? (
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
                    You haven't uploaded any videos yet.
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "favorites" && (
            <>
              <div className="box-header-2007">Favorite Videos ({favorites?.length || 0})</div>
              <div className="bg-card">
                {favorites && favorites.length > 0 ? (
                  favorites.map((video: any) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      thumbnail_url={video.thumbnail_url}
                      views_count={video.views_count}
                      author={video.profiles?.username || "Unknown"}
                      rating={0}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-[11px] text-muted-foreground">
                    You haven't favorited any videos yet.
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <div className="box-header-2007">Account Settings</div>
              <div className="bg-card p-4">
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-[400px]">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Username:</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border border-border px-2 py-1 text-[11px] bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Bio:</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full border border-border px-2 py-1 text-[11px] bg-background resize-none"
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="btn-2007-blue">
                    Save Changes
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
