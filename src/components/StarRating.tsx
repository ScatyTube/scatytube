import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating = ({ rating, interactive = false, onRate }: StarRatingProps) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={10}
        className={`${star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

export default StarRating;
