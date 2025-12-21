import { Link } from "react-router-dom";
import logo from "@/assets/logo.gif";
import { Search, Star, ThumbsUp, ThumbsDown, Eye, MessageSquare, Film } from "lucide-react";
import { useVideos } from "@/hooks/useVideos";
import VideoCard from "@/components/VideoCard";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={10}
        className={star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
      />
    ))}
  </div>
);

const Index = () => {
  const { data: videos, isLoading } = useVideos({ sort: "recent", limit: 8 });
  const { data: topRatedVideos } = useVideos({ sort: "rating", limit: 4 });
  
  const featuredVideo = videos?.[0];

  const formatViews = (views: number | null) => {
    if (!views) return "0";
    return views.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary/50">
        <div className="max-w-[900px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="ScatyTube" className="h-8" />
            </Link>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                className="border border-border px-2 py-1 text-[11px] w-[200px] bg-background"
              />
              <button className="btn-2007 flex items-center gap-1">
                <Search size={12} />
                Search
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <Link to="/auth" className="link-2007">Sign Up</Link>
              <span className="text-muted-foreground">|</span>
              <Link to="/auth" className="link-2007">Log In</Link>
              <span className="text-muted-foreground">|</span>
              <Link to="/help" className="link-2007">Help</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-muted">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="flex gap-1 text-[11px]">
            {[
              { label: "Home", path: "/" },
              { label: "Videos", path: "/videos" },
              { label: "Channels", path: "/channels" },
              { label: "Community", path: "/community" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      <div className="border-b border-border bg-background">
        <div className="max-w-[900px] mx-auto px-4 py-1">
          <div className="flex gap-4 text-[10px] text-muted-foreground">
            <Link to="/videos?sort=views" className="link-2007">Most Viewed</Link>
            <Link to="/videos?sort=rating" className="link-2007">Top Rated</Link>
            <Link to="/videos?sort=recent" className="link-2007">Most Recent</Link>
            <Link to="/videos?sort=comments" className="link-2007">Most Discussed</Link>
            <Link to="/videos?sort=favorites" className="link-2007">Top Favorites</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Left Column - Featured */}
          <div className="w-[340px] flex-shrink-0">
            <div className="border border-border rounded">
              <div className="box-header-2007">Featured Video</div>
              <div className="p-2 bg-card">
                {isLoading ? (
                  <div className="text-[11px] text-muted-foreground p-4">Loading...</div>
                ) : featuredVideo ? (
                  <>
                    <Link to={`/watch/${featuredVideo.id}`}>
                      {featuredVideo.thumbnail_url ? (
                        <img
                          src={featuredVideo.thumbnail_url}
                          alt={featuredVideo.title}
                          className="w-full border border-border"
                        />
                      ) : (
                        <div className="w-full aspect-video border border-border bg-muted flex items-center justify-center">
                          <Film size={48} className="text-muted-foreground" />
                        </div>
                      )}
                    </Link>
                    <Link to={`/watch/${featuredVideo.id}`}>
                      <h3 className="font-bold text-[13px] mt-2 link-2007 cursor-pointer">
                        {featuredVideo.title}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                      {featuredVideo.description}
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
                      <StarRating rating={featuredVideo.rating || 0} />
                      <div className="flex gap-1">
                        <button className="btn-2007 flex items-center gap-1 text-[10px]">
                          <ThumbsUp size={10} />
                        </button>
                        <button className="btn-2007 flex items-center gap-1 text-[10px]">
                          <ThumbsDown size={10} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] mt-2">
                      From: <Link to={`/channel/${featuredVideo.user_id}`} className="link-2007">
                        {featuredVideo.profiles?.username || "Unknown"}
                      </Link>
                    </p>
                  </>
                ) : (
                  <div className="text-[11px] text-muted-foreground p-4">No videos yet</div>
                )}
              </div>
            </div>

            {/* Categories Box */}
            <div className="border border-border rounded mt-4">
              <div className="box-header-2007">Categories</div>
              <div className="p-2 bg-card text-[11px]">
                <div className="grid grid-cols-2 gap-1">
                  {["Autos & Vehicles", "Comedy", "Entertainment", "Film & Animation", 
                    "Gaming", "Howto & Style", "Music", "News & Politics",
                    "People & Blogs", "Pets & Animals", "Science & Tech", "Sports"].map((cat) => (
                    <Link key={cat} to={`/videos?category=${encodeURIComponent(cat)}`} className="link-2007 py-0.5">{cat}</Link>
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
                  <div className="text-[11px] text-muted-foreground p-4">Loading...</div>
                ) : videos && videos.length > 0 ? (
                  videos.slice(1).map((video) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      thumbnail_url={video.thumbnail_url}
                      views_count={video.views_count}
                      author={video.profiles?.username || "Unknown"}
                      rating={video.rating || 0}
                    />
                  ))
                ) : (
                  <div className="text-[11px] text-muted-foreground p-4">No videos yet. Be the first to upload!</div>
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
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full aspect-video object-cover border border-border"
                          />
                        ) : (
                          <div className="w-full aspect-video border border-border bg-muted flex items-center justify-center">
                            <Film size={24} className="text-muted-foreground" />
                          </div>
                        )}
                        <p className="text-[10px] link-2007 mt-1 truncate">{video.title}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground">No videos yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted mt-8">
        <div className="max-w-[900px] mx-auto px-4 py-4">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <div className="flex gap-4">
              <Link to="#" className="link-2007">About</Link>
              <Link to="/help" className="link-2007">Help</Link>
              <Link to="#" className="link-2007">Terms of Use</Link>
              <Link to="#" className="link-2007">Privacy Policy</Link>
              <Link to="#" className="link-2007">Safety Mode</Link>
            </div>
            <p>© 2007 ScatyTube, LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
