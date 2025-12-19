import { ReactNode, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import logo from "@/assets/logo.png";
import logoAprilFools from "@/assets/logo-april-fools.png";

const isAprilFools = () => {
  const today = new Date();
  return today.getMonth() === 3 && today.getDate() === 1; // April is month 3 (0-indexed)
};

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Track online status
  useOnlineStatus();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/videos?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-secondary/50">
        <div className="max-w-[900px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img src={isAprilFools() ? logoAprilFools : logo} alt="ScatyTube" className="h-8" />
            </Link>
            
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-border px-2 py-1 text-[11px] w-[200px] bg-background"
              />
              <button type="submit" className="btn-2007 flex items-center gap-1">
                <Search size={12} />
                Search
              </button>
            </form>

            <div className="flex items-center gap-2 text-[11px]">
              {user ? (
                <>
                  <Link to="/profile" className="link-2007">My Account</Link>
                  <span className="text-muted-foreground">|</span>
                  <button onClick={signOut} className="link-2007">Log Out</button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=signup" className="link-2007">Sign Up</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/auth?mode=login" className="link-2007">Log In</Link>
                </>
              )}
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
              { name: "Home", path: "/" },
              { name: "Videos", path: "/videos" },
              { name: "Channels", path: "/channels" },
              { name: "Community", path: "/community" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {item.name}
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
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted mt-8">
        <div className="max-w-[900px] mx-auto px-4 py-4">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <div className="flex gap-4">
              <Link to="/help" className="link-2007">About</Link>
              <Link to="/help" className="link-2007">Help</Link>
              <Link to="/help" className="link-2007">Terms of Use</Link>
              <Link to="/help" className="link-2007">Privacy Policy</Link>
              <Link to="/help" className="link-2007">Safety Mode</Link>
            </div>
            <p>© 2007 ScatyTube, LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
