import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Search, MessageSquare, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary to-[hsl(250_84%_54%)] rounded-lg">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Spani Plug</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-[hsl(250_84%_54%)] bg-clip-text text-transparent">
          Connect with Trusted Service Providers
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          South Africa's first free, mobile-first marketplace for skilled workers.
          Find plumbers, electricians, cleaners, and more in your area.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate("/discovery")}>
            Find Services
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/signup")}>
            Join as Provider
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
            <p className="text-muted-foreground">
              Find skilled workers by location and service type with autocomplete search
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Social Reviews</h3>
            <p className="text-muted-foreground">
              See before/after photos, like reviews, and join the community conversation
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Post Jobs</h3>
            <p className="text-muted-foreground">
              Upload images and post jobs visible only to relevant service providers
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of South Africans connecting with trusted service providers in their community
          </p>
          <Button size="lg" onClick={() => navigate("/discovery")}>
            Explore Services
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
