import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Search, MessageSquare, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <nav className="fixed top-0 left-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className=" mx-auto px-4 py-4 flex items-center justify-between">
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

      <section className="relative flex flex-col justify-center h-[76vh] mx-auto mt-18 px-4 py-20 text-center bg-[url('./Hero.jpg')] bg-cover bg-center ">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative  z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-[hsl(250_84%_54%)] bg-clip-text text-transparent">
            Connect with Trusted Service Providers
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            South Africa's first formal marketplace for skilled and informal skills workers.
            Find your next service provider with just one click.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/discovery")}>
              Find Services
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/signup")}>
              Join as Provider
            </Button>
          </div>
        </div>
      </section>


      <section className="container mx-auto px-4 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ultimate Convenience</h3>
            <p className="text-muted-foreground">
              Spani Plug makes finding, hiring, and paying skilled workers effortless.  
              No long calls or travel — just search, connect, and get the job done from your phone.
            </p>
        </div>
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
