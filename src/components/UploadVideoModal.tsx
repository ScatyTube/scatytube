import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Film, Image, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Entertainment",
  "Music",
  "Gaming",
  "News & Politics",
  "Comedy",
  "Education",
  "Science & Technology",
  "Sports",
  "Howto & Style",
  "Pets & Animals",
  "People & Blogs",
  "Autos & Vehicles",
  "Travel & Events",
  "Film & Animation",
];

interface UploadVideoModalProps {
  trigger?: React.ReactNode;
}

const UploadVideoModal = ({ trigger }: UploadVideoModalProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Entertainment");
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to upload videos");
      return;
    }

    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      // Upload video file
      const videoFileName = `${user.id}/${Date.now()}-${videoFile.name}`;
      setUploadProgress(20);

      const { error: videoError } = await supabase.storage
        .from("videos")
        .upload(videoFileName, videoFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (videoError) {
        throw new Error(`Video upload failed: ${videoError.message}`);
      }

      setUploadProgress(60);

      // Get video public URL
      const { data: videoUrlData } = supabase.storage
        .from("videos")
        .getPublicUrl(videoFileName);

      let thumbnailUrl = null;

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const thumbnailFileName = `${user.id}/${Date.now()}-${thumbnailFile.name}`;

        const { error: thumbnailError } = await supabase.storage
          .from("thumbnails")
          .upload(thumbnailFileName, thumbnailFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (thumbnailError) {
          console.warn("Thumbnail upload failed:", thumbnailError);
        } else {
          const { data: thumbnailUrlData } = supabase.storage
            .from("thumbnails")
            .getPublicUrl(thumbnailFileName);
          thumbnailUrl = thumbnailUrlData.publicUrl;
        }
      }

      setUploadProgress(80);

      // Insert video record
      const { error: dbError } = await supabase.from("videos").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        category,
        video_url: videoUrlData.publicUrl,
        thumbnail_url: thumbnailUrl,
      });

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      setUploadProgress(100);
      toast.success("Video uploaded successfully!");
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="btn-2007 flex items-center gap-1">
            <Upload size={12} />
            Upload Video
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border p-0">
        <DialogHeader className="box-header-2007 rounded-t-lg">
          <DialogTitle className="text-foreground font-bold text-[12px]">
            Upload Video
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpload} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-border px-2 py-1 text-[11px] bg-background"
              placeholder="Enter video title"
              maxLength={100}
              disabled={uploading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-border px-2 py-1 text-[11px] bg-background resize-none"
              placeholder="Enter video description"
              rows={3}
              maxLength={5000}
              disabled={uploading}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-border px-2 py-1 text-[11px] bg-background"
              disabled={uploading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Video File */}
          <div>
            <label className="block text-[11px] font-bold mb-1">
              <Film size={12} className="inline mr-1" />
              Video File *
            </label>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="w-full text-[11px]"
              disabled={uploading}
            />
            {videoFile && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-[11px] font-bold mb-1">
              <Image size={12} className="inline mr-1" />
              Thumbnail (optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="w-full text-[11px]"
              disabled={uploading}
            />
            {thumbnailFile && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Selected: {thumbnailFile.name}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="w-full bg-muted rounded h-2">
              <div
                className="bg-primary h-2 rounded transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-2007"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-2007 flex items-center gap-1"
              disabled={uploading || !videoFile || !title.trim()}
            >
              {uploading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={12} />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoModal;
