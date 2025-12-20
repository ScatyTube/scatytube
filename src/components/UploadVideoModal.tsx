import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-[500px] p-0 border-0 bg-transparent shadow-none">
        <div className="border border-border rounded bg-card shadow-lg">
          {/* Retro Header */}
          <div className="box-header-2007 flex items-center gap-2">
            <Film size={14} />
            <span>Video Upload</span>
          </div>

          <form onSubmit={handleUpload} className="p-3 space-y-3 bg-secondary/30">
            {/* Info Box */}
            <div className="bg-[hsl(45,100%,95%)] border border-[hsl(45,80%,70%)] p-2 text-[10px] rounded">
              <strong>📹 Upload your video to ScatyTube!</strong>
              <br />
              Max video size: 100MB • Supported: MP4, WebM, OGG
            </div>

            {/* Title */}
            <div className="border border-border rounded bg-card">
              <div className="bg-muted px-2 py-1 border-b border-border">
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Title *
                </label>
              </div>
              <div className="p-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-border px-2 py-1.5 text-[11px] bg-background focus:outline-none focus:border-primary"
                  placeholder="Enter video title..."
                  maxLength={100}
                  disabled={uploading}
                />
              </div>
            </div>

            {/* Description */}
            <div className="border border-border rounded bg-card">
              <div className="bg-muted px-2 py-1 border-b border-border">
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Description
                </label>
              </div>
              <div className="p-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-border px-2 py-1.5 text-[11px] bg-background resize-none focus:outline-none focus:border-primary"
                  placeholder="Tell viewers about your video..."
                  rows={3}
                  maxLength={5000}
                  disabled={uploading}
                />
              </div>
            </div>

            {/* Category */}
            <div className="border border-border rounded bg-card">
              <div className="bg-muted px-2 py-1 border-b border-border">
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Category
                </label>
              </div>
              <div className="p-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-border px-2 py-1.5 text-[11px] bg-background focus:outline-none focus:border-primary"
                  disabled={uploading}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Uploads Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Video File */}
              <div className="border border-border rounded bg-card">
                <div className="bg-muted px-2 py-1 border-b border-border flex items-center gap-1">
                  <Film size={10} />
                  <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Video *
                  </label>
                </div>
                <div className="p-2">
                  <label className="block">
                    <div className={`border-2 border-dashed rounded p-3 text-center cursor-pointer transition-colors ${
                      videoFile 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}>
                      {videoFile ? (
                        <div className="text-[10px]">
                          <span className="text-green-600 font-bold">✓ Selected</span>
                          <p className="truncate mt-1 text-muted-foreground">{videoFile.name}</p>
                          <p className="text-muted-foreground">
                            {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-[10px] text-muted-foreground">
                          <Upload size={16} className="mx-auto mb-1" />
                          Click to browse
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="border border-border rounded bg-card">
                <div className="bg-muted px-2 py-1 border-b border-border flex items-center gap-1">
                  <Image size={10} />
                  <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Thumbnail
                  </label>
                </div>
                <div className="p-2">
                  <label className="block">
                    <div className={`border-2 border-dashed rounded p-3 text-center cursor-pointer transition-colors ${
                      thumbnailFile 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}>
                      {thumbnailFile ? (
                        <div className="text-[10px]">
                          <span className="text-green-600 font-bold">✓ Selected</span>
                          <p className="truncate mt-1 text-muted-foreground">{thumbnailFile.name}</p>
                        </div>
                      ) : (
                        <div className="text-[10px] text-muted-foreground">
                          <Image size={16} className="mx-auto mb-1" />
                          Optional
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="border border-border rounded bg-card p-2">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-bold">Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded h-3 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${uploadProgress}%`,
                      background: 'linear-gradient(180deg, hsl(217 80% 55%) 0%, hsl(217 89% 45%) 100%)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
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
                className="btn-2007-blue flex items-center gap-1"
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
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoModal;
