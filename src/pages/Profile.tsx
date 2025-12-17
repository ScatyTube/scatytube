import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfiles";
import { useVideos, useFavoriteVideos } from "@/hooks/useVideos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"videos" | "favorites" | "settings">("videos");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile(user?.id || "");
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
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateProfile.mutate(
      { userId: user.id, updates: { bio } },
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setUploading(true);
    
    try {
      // Convert to base64 data URL for simple storage
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        
        // Update profile with new avatar
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: dataUrl })
          .eq("id", user.id);

        if (error) {
          toast.error("Failed to update avatar");
        } else {
          toast.success("Avatar updated!");
          refetchProfile();
        }
        setUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload avatar");
      setUploading(false);
    }
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
              {/* Avatar with click to change */}
              <div className="relative group">
                <img
                  src={profile.avatar_url || "https://picsum.photos/seed/avatar/100/100"}
                  alt={profile.username}
                  className="w-24 h-24 rounded border border-border cursor-pointer object-cover"
                  onClick={handleAvatarClick}
                />
                <div 
                  className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <span className="text-white text-[10px] text-center px-1">
                    {uploading ? "Uploading..." : "Click to change"}
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
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
                <p className="text-[10px] text-muted-foreground mt-1">
                  Member since: {new Date(profile.created_at || "").toLocaleDateString()}
                </p>
                {profile.last_seen && !profile.is_online && (
                  <p className="text-[10px] text-muted-foreground">
                    Last seen: {new Date(profile.last_seen).toLocaleString()}
                  </p>
                )}
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
                  {/* Username (read-only) */}
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Username:</label>
                    <input
                      type="text"
                      value={profile.username}
                      className="w-full border border-border px-2 py-1 text-[11px] bg-muted text-muted-foreground cursor-not-allowed"
                      disabled
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Usernames are permanent and cannot be changed.
                    </p>
                  </div>

                  {/* Avatar Change Section */}
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Profile Picture:</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.avatar_url || "https://picsum.photos/seed/avatar/100/100"}
                        alt="Current avatar"
                        className="w-16 h-16 rounded border border-border object-cover"
                      />
                      <div>
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          className="btn-2007"
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Change Picture"}
                        </button>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-[11px] font-bold mb-1">About Me:</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full border border-border px-2 py-1 text-[11px] bg-background resize-none"
                      rows={4}
                      placeholder="Tell others about yourself..."
                      maxLength={500}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {bio.length}/500 characters
                    </p>
                  </div>

                  <button type="submit" className="btn-2007-blue" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
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