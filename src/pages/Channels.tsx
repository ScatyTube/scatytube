import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useChannels } from "@/hooks/useProfiles";

const Channels = () => {
  const { data: channels, isLoading } = useChannels(50);

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="border border-border rounded">
          <div className="box-header-2007">Channels</div>
          <div className="bg-card p-4">
            {isLoading ? (
              <div className="text-center text-[11px] text-muted-foreground">
                Loading channels...
              </div>
            ) : channels && channels.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {channels.map((channel) => (
                  <Link
                    key={channel.id}
                    to={`/channel/${channel.id}`}
                    className="text-center hover:bg-muted/50 p-2 rounded"
                  >
                    <img
                      src={channel.avatar_url || "https://picsum.photos/seed/avatar/80/80"}
                      alt={channel.username}
                      className="w-20 h-20 mx-auto rounded border border-border"
                    />
                    <p className="link-2007 text-[11px] font-bold mt-2 truncate">
                      {channel.username}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {channel.subscribers_count || 0} subscribers
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-[11px] text-muted-foreground py-8">
                No channels found. Sign up to create your channel!
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Channels;
