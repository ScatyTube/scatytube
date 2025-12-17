import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("The username or password you entered is incorrect.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back to ScatyTube!");
          navigate("/");
        }
      } else {
        if (!username.trim()) {
          toast.error("Please choose a username for your account.");
          setLoading(false);
          return;
        }
        if (username.length < 3) {
          toast.error("Username must be at least 3 characters.");
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("This email address is already registered.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Thanks for signing up! Your account has been created.");
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto">
          <div className="border border-border rounded">
            <div className="box-header-2007">
              {isLogin ? "Log In to Your Account" : "Join ScatyTube!"}
            </div>
            <div className="p-4 bg-card">
              {/* 2007 style welcome message */}
              <div className="bg-muted border border-border p-3 mb-4 text-[11px]">
                {isLogin ? (
                  <>
                    <p className="font-bold mb-1">Welcome Back!</p>
                    <p className="text-muted-foreground">
                      Sign in to upload videos, post comments, and rate your favorite videos.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold mb-1">Create Your Free Account</p>
                    <p className="text-muted-foreground">
                      Join the ScatyTube community! Upload and share videos, post comments, 
                      rate videos, save favorites, subscribe to channels, and more!
                    </p>
                    <p className="text-destructive mt-2 font-bold">
                      ⚠️ Choose your username carefully - it cannot be changed later!
                    </p>
                  </>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-bold mb-1">
                      Username: <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border border-border px-2 py-1 text-[11px] bg-background"
                      placeholder="This will be your permanent username"
                      required={!isLogin}
                      minLength={3}
                      maxLength={20}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      3-20 characters. This cannot be changed.
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-bold mb-1">
                    Email Address: <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border px-2 py-1 text-[11px] bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1">
                    Password: <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border px-2 py-1 text-[11px] bg-background"
                    required
                    minLength={6}
                  />
                  {!isLogin && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Must be at least 6 characters.
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-2007-blue w-full py-2"
                >
                  {loading ? "Please wait..." : isLogin ? "Log In" : "Create My Account"}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-border text-center text-[11px]">
                {isLogin ? (
                  <p>
                    New to ScatyTube?{" "}
                    <Link to="/auth?mode=signup" className="link-2007 font-bold">
                      Create an Account
                    </Link>
                  </p>
                ) : (
                  <p>
                    Already a member?{" "}
                    <Link to="/auth?mode=login" className="link-2007 font-bold">
                      Log In
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;