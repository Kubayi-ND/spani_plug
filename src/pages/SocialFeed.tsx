import { Navbar } from "@/components/Navbar";
import { SocialReviewFeed } from "@/components/SocialReviewFeed";

const SocialFeed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SocialReviewFeed />
      </div>
    </div>
  );
};

export default SocialFeed;
