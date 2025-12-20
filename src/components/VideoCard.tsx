import { Link } from "react-router-dom";
import { Eye, Film } from "lucide-react";
import StarRating from "./StarRating";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail_url: string | null;
  views_count: number | null;
  author: string;
  rating: number;
}

const VideoCard = ({ id, title, thumbnail_url, views_count, author, rating }: VideoCardProps) => {
  const formatViews = (views: number | null) => {
    if (!views) return "0";
    return views.toLocaleString();
  };

  return (
    <Link
      to={`/watch/${id}`}
      className="flex gap-2 p-2 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer"
    >
      {thumbnail_url ? (
        <img
          src={thumbnail_url}
          alt={title}
          className="w-[120px] h-[90px] object-cover border border-border flex-shrink-0"
        />
      ) : (
        <div className="w-[120px] h-[90px] border border-border flex-shrink-0 bg-muted flex items-center justify-center">
          <Film size={32} className="text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[12px] link-2007 truncate">
          {title}
        </h4>
        <p className="text-[10px] text-muted-foreground mt-1">
          From: <span className="link-2007">{author}</span>
        </p>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <Eye size={10} /> {formatViews(views_count)} views
        </p>
        <div className="mt-1">
          <StarRating rating={rating} />
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
