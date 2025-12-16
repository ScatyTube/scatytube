import logo from "@/assets/logo.gif";
import { Search, Star, ThumbsUp, ThumbsDown, Eye, MessageSquare } from "lucide-react";

const mockVideos = [
  { id: 1, title: "Funny Cat Compilation 2007", views: "1,234,567", author: "catLover2007", thumbnail: "https://picsum.photos/seed/cat1/120/90", rating: 4.5 },
  { id: 2, title: "How to Dance Tutorial", views: "892,345", author: "danceMaster", thumbnail: "https://picsum.photos/seed/dance/120/90", rating: 4.2 },
  { id: 3, title: "Amazing Guitar Solo", views: "567,890", author: "guitarHero99", thumbnail: "https://picsum.photos/seed/guitar/120/90", rating: 4.8 },
  { id: 4, title: "Skateboard Tricks Gone Wrong", views: "2,345,678", author: "sk8rboi", thumbnail: "https://picsum.photos/seed/skate/120/90", rating: 3.9 },
  { id: 5, title: "My Room Tour 2007", views: "123,456", author: "coolKid123", thumbnail: "https://picsum.photos/seed/room/120/90", rating: 3.5 },
  { id: 6, title: "Unboxing New iPod", views: "456,789", author: "techReviewer", thumbnail: "https://picsum.photos/seed/ipod/120/90", rating: 4.1 },
  { id: 7, title: "Cute Puppy Playing", views: "3,456,789", author: "puppyLove", thumbnail: "https://picsum.photos/seed/puppy/120/90", rating: 4.9 },
  { id: 8, title: "Epic Fail Compilation", views: "5,678,901", author: "funnyVids", thumbnail: "https://picsum.photos/seed/fail/120/90", rating: 4.3 },
];

const featuredVideo = {
  title: "Charlie Bit My Finger - Again!",
  views: "12,345,678",
  author: "HDCYT",
  description: "Even Charlie loved this video enough to put his finger in it again...",
  thumbnail: "https://picsum.photos/seed/charlie/320/240",
  comments: 45678,
  rating: 4.7,
};

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
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary/50">
        <div className="max-w-[900px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <img src={logo} alt="ScatyTube" className="h-8" />
            
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
              <a href="#" className="link-2007">Sign Up</a>
              <span className="text-muted-foreground">|</span>
              <a href="#" className="link-2007">Log In</a>
              <span className="text-muted-foreground">|</span>
              <a href="#" className="link-2007">Help</a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-muted">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="flex gap-1 text-[11px]">
            {["Home", "Videos", "Channels", "Community"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      <div className="border-b border-border bg-background">
        <div className="max-w-[900px] mx-auto px-4 py-1">
          <div className="flex gap-4 text-[10px] text-muted-foreground">
            <a href="#" className="link-2007">Most Viewed</a>
            <a href="#" className="link-2007">Top Rated</a>
            <a href="#" className="link-2007">Most Recent</a>
            <a href="#" className="link-2007">Most Discussed</a>
            <a href="#" className="link-2007">Top Favorites</a>
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
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full border border-border"
                />
                <h3 className="font-bold text-[13px] mt-2 link-2007 cursor-pointer">
                  {featuredVideo.title}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {featuredVideo.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye size={10} /> {featuredVideo.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={10} /> {featuredVideo.comments}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <StarRating rating={featuredVideo.rating} />
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
                  From: <a href="#" className="link-2007">{featuredVideo.author}</a>
                </p>
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
                    <a key={cat} href="#" className="link-2007 py-0.5">{cat}</a>
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
                {mockVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex gap-2 p-2 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-[120px] h-[90px] object-cover border border-border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[12px] link-2007 truncate">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        From: <a href="#" className="link-2007">{video.author}</a>
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Eye size={10} /> {video.views} views
                      </p>
                      <div className="mt-1">
                        <StarRating rating={video.rating} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promoted Videos */}
            <div className="border border-border rounded mt-4">
              <div className="box-header-2007">Promoted Videos</div>
              <div className="p-2 bg-card">
                <div className="grid grid-cols-4 gap-2">
                  {mockVideos.slice(0, 4).map((video) => (
                    <div key={video.id} className="cursor-pointer">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full border border-border"
                      />
                      <p className="text-[10px] link-2007 mt-1 truncate">{video.title}</p>
                    </div>
                  ))}
                </div>
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
              <a href="#" className="link-2007">About</a>
              <a href="#" className="link-2007">Help</a>
              <a href="#" className="link-2007">Terms of Use</a>
              <a href="#" className="link-2007">Privacy Policy</a>
              <a href="#" className="link-2007">Safety Mode</a>
            </div>
            <p>© 2007 ScatyTube, LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
