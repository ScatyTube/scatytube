import Layout from "@/components/Layout";

const Help = () => {
  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-[200px] flex-shrink-0">
            <div className="border border-border rounded">
              <div className="box-header-2007">Help Topics</div>
              <div className="p-2 bg-card text-[11px]">
                <a href="#about" className="block py-0.5 link-2007">About ScatyTube</a>
                <a href="#account" className="block py-0.5 link-2007">Account Help</a>
                <a href="#watching" className="block py-0.5 link-2007">Watching Videos</a>
                <a href="#uploading" className="block py-0.5 link-2007">Uploading Videos</a>
                <a href="#community" className="block py-0.5 link-2007">Community Guidelines</a>
                <a href="#privacy" className="block py-0.5 link-2007">Privacy Policy</a>
                <a href="#terms" className="block py-0.5 link-2007">Terms of Use</a>
                <a href="#contact" className="block py-0.5 link-2007">Contact Us</a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="border border-border rounded mb-4" id="about">
              <div className="box-header-2007">About ScatyTube</div>
              <div className="bg-card p-4 text-[11px]">
                <p>
                  Welcome to ScatyTube! We're a video sharing website where you can upload,
                  share, and watch videos. Our community-driven platform allows users from
                  around the world to connect through video content.
                </p>
                <p className="mt-2">
                  ScatyTube was founded in 2007 with a simple mission: to give everyone
                  a voice and show them the world. We believe in the power of video to
                  inspire, educate, and entertain.
                </p>
              </div>
            </div>

            <div className="border border-border rounded mb-4" id="account">
              <div className="box-header-2007">Account Help</div>
              <div className="bg-card p-4 text-[11px]">
                <h3 className="font-bold mb-2">Creating an Account</h3>
                <p>
                  To create an account, click "Sign Up" in the top right corner of any page.
                  You'll need to provide a username, email address, and password.
                </p>
                <h3 className="font-bold mb-2 mt-4">Logging In</h3>
                <p>
                  Click "Log In" and enter your email and password to access your account.
                </p>
                <h3 className="font-bold mb-2 mt-4">Managing Your Profile</h3>
                <p>
                  Visit "My Account" to update your username, bio, and other profile settings.
                </p>
              </div>
            </div>

            <div className="border border-border rounded mb-4" id="watching">
              <div className="box-header-2007">Watching Videos</div>
              <div className="bg-card p-4 text-[11px]">
                <h3 className="font-bold mb-2">Finding Videos</h3>
                <p>
                  Use the search bar to find videos by title. Browse by category or check
                  out the Most Viewed, Top Rated, Most Recent, and Most Discussed sections.
                </p>
                <h3 className="font-bold mb-2 mt-4">Rating Videos</h3>
                <p>
                  Click the stars to rate a video from 1 to 5. You must be logged in to rate.
                </p>
                <h3 className="font-bold mb-2 mt-4">Commenting</h3>
                <p>
                  Share your thoughts by leaving a comment! Log in and type in the comment
                  box below any video.
                </p>
              </div>
            </div>

            <div className="border border-border rounded mb-4" id="community">
              <div className="box-header-2007">Community Guidelines</div>
              <div className="bg-card p-4 text-[11px]">
                <p>ScatyTube is built on respect. Please follow these guidelines:</p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Be respectful to other users</li>
                  <li>Don't post spam or misleading content</li>
                  <li>Don't post content that's harmful or dangerous</li>
                  <li>Respect copyrights and only upload content you own</li>
                  <li>Don't post content that promotes violence or hate</li>
                </ul>
              </div>
            </div>

            <div className="border border-border rounded mb-4" id="privacy">
              <div className="box-header-2007">Privacy Policy</div>
              <div className="bg-card p-4 text-[11px]">
                <p>
                  Your privacy is important to us. We collect only the information necessary
                  to provide our services. Your email address is kept private and is only
                  used for account-related communications.
                </p>
                <p className="mt-2">
                  We use cookies to improve your experience on our site. By using ScatyTube,
                  you agree to our use of cookies.
                </p>
              </div>
            </div>

            <div className="border border-border rounded mb-4" id="terms">
              <div className="box-header-2007">Terms of Use</div>
              <div className="bg-card p-4 text-[11px]">
                <p>By using ScatyTube, you agree to:</p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Follow our Community Guidelines</li>
                  <li>Not use the service for illegal purposes</li>
                  <li>Not attempt to access other users' accounts</li>
                  <li>Take responsibility for content you upload</li>
                  <li>Accept that we may remove content that violates our policies</li>
                </ul>
              </div>
            </div>

            <div className="border border-border rounded" id="contact">
              <div className="box-header-2007">Contact Us</div>
              <div className="bg-card p-4 text-[11px]">
                <p>
                  Have questions or need help? We're here for you!
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> support@scatytube.com
                </p>
                <p className="mt-1">
                  <strong>Response Time:</strong> Within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
