import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { useVideos, SortOption } from "@/hooks/useVideos";

const categories = [
  "All", "Autos & Vehicles", "Comedy", "Entertainment", "Film & Animation",
  "Gaming", "Howto & Style", "Music", "News & Politics",
  "People & Blogs", "Pets & Animals", "Science & Tech", "Sports"
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "views", label: "Most Viewed" },
  { value: "rating", label: "Top Rated" },
  { value: "comments", label: "Most Discussed" },
  { value: "favorites", label: "Top Favorites" },
];

const Videos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = (searchParams.get("sort") as SortOption) || "recent";
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const { data: videos, isLoading } = useVideos({
    sort,
    category: category && category !== "All" ? category : undefined,
    search: search || undefined,
    limit: 50,
  });

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    setSearchParams(params);
  };

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-[200px] flex-shrink-0">
            <div className="border border-border rounded">
              <div className="box-header-2007">Categories</div>
              <div className="p-2 bg-card text-[11px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`block w-full text-left py-0.5 ${
                      (cat === "All" && !category) || cat === category
                        ? "font-bold text-foreground"
                        : "link-2007"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-border rounded mt-4">
              <div className="box-header-2007">Sort By</div>
              <div className="p-2 bg-card text-[11px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full text-left py-0.5 ${
                      sort === option.value ? "font-bold text-foreground" : "link-2007"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video List */}
          <div className="flex-1">
            <div className="border border-border rounded">
              <div className="box-header-2007">
                {search ? `Search Results for "${search}"` : category || "All Videos"}
                {" - "}
                {sortOptions.find((o) => o.value === sort)?.label}
              </div>
              <div className="bg-card">
                {isLoading ? (
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Videos;
