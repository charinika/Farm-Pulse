import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Farm Pulse</h1>
            </div>
            <Button asChild>
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Complete Livestock <span className="text-primary">Health Management</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Manage your livestock health, track medical records, set reminders, and connect with veterinary professionals
            all in one comprehensive platform designed for modern farmers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <a href="/api/login">Get Started</a>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift">
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Health Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete health records, vaccination schedules, and medical history for each animal.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <Shield className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>Smart Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Never miss a vaccination or medication with intelligent reminder systems.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <Users className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Expert Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with veterinarians and fellow farmers for advice and support.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-success mb-2" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gain insights into your herd's health trends and optimize farm management.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm Management?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers who trust Farm Pulse for their livestock health management.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/api/login">Start Free Trial</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
