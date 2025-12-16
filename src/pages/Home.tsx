import { Link } from "react-router-dom";
import { Eye, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import StarRating from "@/components/StarRating";
import VideoCard from "@/components/VideoCard";
import { useVideos } from "@/hooks/useVideos";

const categories = [
  "Autos & Vehicles", "Comedy", "Entertainment", "Film & Animation",
  "Gaming", "Howto & Style", "Music", "News & Politics",
  "People & Blogs", "Pets & Animals", "Science & Tech", "Sports"
];

const Home = () => {
  const { data: recentVideos, isLoading } = useVideos({ sort: "recent", limit: 8 });
  const { data: topRatedVideos } = useVideos({ sort: "rating", limit: 4 });

  const featuredVideo = recentVideos?.[0];

  const formatViews = (views: number | null) => {
    if (!views) return "0";
    return views.toLocaleString();
  };

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Left Column - Featured */}
          <div className="w-[340px] flex-shrink-0">
            <div className="border border-border rounded">
              <div className="box-header-2007">Featured Video</div>
              <div className="p-2 bg-card">
                {featuredVideo ? (
                  <>
                    <Link to={`/watch/${featuredVideo.id}`}>
                      <img
                        src={featuredVideo.thumbnail_url || "https://picsum.photos/seed/featured/320/240"}
                        alt={featuredVideo.title}
                        className="w-full border border-border"
                      />
                    </Link>
                    <Link
                      to={`/watch/${featuredVideo.id}`}
                      className="font-bold text-[13px] mt-2 link-2007 block"
                    >
                      {featuredVideo.title}
                    </Link>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {featuredVideo.description?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye size={10} /> {formatViews(featuredVideo.views_count)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={10} /> {featuredVideo.comments_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <StarRating rating={featuredVideo.rating} />
                    </div>
                    <p className="text-[10px] mt-2">
                      From:{" "}
                      <Link
                        to={`/channel/${featuredVideo.user_id}`}
                        className="link-2007"
                      >
                        {featuredVideo.profiles?.username || "Unknown"}
                      </Link>
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8 text-[11px] text-muted-foreground">
                    {isLoading ? "Loading..." : "No videos yet. Be the first to upload!"}
                  </div>
                )}
              </div>
            </div>

            {/* Categories Box */}
            <div className="border border-border rounded mt-4">
              <div className="box-header-2007">Categories</div>
              <div className="p-2 bg-card text-[11px]">
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/videos?category=${encodeURIComponent(cat)}`}
                      className="link-2007 py-0.5"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Video List */}
          <div className="flex-1">
            <div className="border border-border rounded">
              <div className="box-header-2007">Videos Being Watched Right Now...</div>
              <div className="bg-card">
                {isLoading ? (
                  <div className="p-4 text-center text-[11px] text-muted-foreground">
                    Loading videos...
                  </div>
                ) : recentVideos && recentVideos.length > 0 ? (
                  recentVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      thumbnail_url={video.thumbnail_url}
                      views_count={video.views_count}
                      author={video.profiles?.username || "Unknown"}
                      rating={video.rating}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-[11px] text-muted-foreground">
                    No videos found. Be the first to upload!
                  </div>
                )}
              </div>
            </div>

            {/* Promoted Videos */}
            <div className="border border-border rounded mt-4">
              <div className="box-header-2007">Top Rated Videos</div>
              <div className="p-2 bg-card">
                {topRatedVideos && topRatedVideos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {topRatedVideos.map((video) => (
                      <Link key={video.id} to={`/watch/${video.id}`} className="cursor-pointer">
                        <img
                          src={video.thumbnail_url || "https://picsum.photos/seed/default/120/90"}
                          alt={video.title}
                          className="w-full border border-border"
                        />
                        <p className="text-[10px] link-2007 mt-1 truncate">{video.title}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[11px] text-muted-foreground">
                    No top rated videos yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
