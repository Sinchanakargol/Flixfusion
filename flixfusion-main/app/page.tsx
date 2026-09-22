import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // Import Clerk's authentication hook
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideFilm, LucideSearch, LucideMonitor } from "lucide-react";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="absolute top-4 right-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-gray-900 text-white">
        <div className="absolute inset-0 z-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="z-10 text-center max-w-4xl px-8">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight animate-fade-in">
            Discover Your Next Favorite Show
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-300 animate-fade-in-delay">
            All your favorite movies and TV shows in one place.
          </p>
          <div className="mt-8 space-x-4 animate-slide-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Link href={`/search`}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-transform transform hover:scale-105"
              >
                <CardHeader>
                  <div className="text-primary p-4 bg-primary/10 rounded-full w-fit mx-auto">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-center mt-4 text-2xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-4 text-center text-gray-600">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to Start Exploring?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of users discovering amazing entertainment.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    icon: <LucideFilm size={32} />,
    title: "Extensive Library",
    description:
      "Access millions of movies, TV shows, and exclusive content from multiple platforms.",
  },
  {
    icon: <LucideSearch size={32} />,
    title: "Smart Recommendations",
    description:
      "AI-powered recommendations to help you discover shows tailored to your taste.",
  },
  {
    icon: <LucideMonitor size={32} />,
    title: "Multi-Device Support",
    description:
      "Stream seamlessly across all your devices without interruptions.",
  },
];
