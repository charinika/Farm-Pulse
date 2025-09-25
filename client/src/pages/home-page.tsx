import React from "react";
import { useLocation } from "wouter";
import { Stethoscope, Bell, Activity, Users, MessageSquare, LayoutDashboard, AlertTriangle, Siren } from "lucide-react";

const HomePage = () => {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: "Livestock Profiles",
      description: "Track and manage detailed profiles of your animals with ease.",
      icon: <Stethoscope className="w-12 h-12 text-blue-400" />,
      link: "/livestock",
    },
    
    {
      title: "Reminders",
      description: "Stay on top of feedings, checkups, and important schedules.",
      icon: <Bell className="w-12 h-12 text-blue-400" />,
      link: "/reminders",
    },
    {
      title: "Disease Diagnosis",
      description: "Upload images and get AI-powered disease predictions.",
      icon: <Activity className="w-12 h-12 text-blue-400" />,
      link: "/disease-diagnosis",
    },
    {
      title: "Emergency Protocols",
      description: "Access critical procedures for handling farm emergencies.",
      icon: <Siren className="w-12 h-12 text-blue-400" />,
      link: "/emergency-protocols",
    },
    {
      title: "Community Forum",
      description: "Connect with other farmers and share best practices.",
      icon: <Users className="w-12 h-12 text-blue-400" />,
      link: "/community-forum",
    },
    {
      title: "AI Chatbot",
      description: "Get instant answers to your farming-related questions.",
      icon: <MessageSquare className="w-12 h-12 text-blue-400" />,
      link: "/chatbot",
    },
    {
      title: "Symptom Alerts",
      description: "Receive notifications for potential health issues in livestock.",
      icon: <AlertTriangle className="w-12 h-12 text-blue-400" />,
      link: "/symptoms",
    },
    {
      title: "Nutrition Recommendation",
      description: "Receive personalised nutrition suggestion for each livestock",
      icon: <MessageSquare className="w-12 h-12 text-blue-400" />,
      link: "/nutrition",

    }
  ];

  const handleNavigation = (link: string) => {
    setLocation(link);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-stone-100">
      {/* Hero Section */}
      <div className="relative w-full h-screen min-h-[400px] border border-red-500">
        {/* Gradient Overlay Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-stone-400 bg-opacity-50 z-10" />
        <div className="relative z-20 flex flex-col items-start justify-center h-full text-white px-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Farm Pulse
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl drop-shadow-md">
            Smart livestock management for healthier animals and a more productive farm.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setLocation("/dashboard")}
              className="px-6 py-3 bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 bg-white text-blue-400 rounded-lg font-semibold hover:bg-stone-200 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-stone-800">Explore Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onClick={() => handleNavigation(feature.link)}
                className="p-8 bg-stone-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer h-80 flex flex-col items-center justify-center border border-stone-300"
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-6 mb-4 text-stone-800">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farm Tips Section */}
      <section className="py-20 bg-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-stone-800">Farmer Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-xl shadow-md">
              <h3 className="text-md font-semibold mb-2 text-stone-800">Optimal Feeding Times</h3>
              <p className="text-sm text-gray-600">Feed your livestock during cooler parts of the day to improve digestion and reduce heat stress.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <h3 className="text-md font-semibold mb-2 text-stone-800">Water Quality</h3>
              <p className="text-sm text-gray-600">Ensure clean, fresh water daily to maintain animal health and productivity.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <h3 className="text-md font-semibold mb-2 text-stone-800">Regular Checkups</h3>
              <p className="text-sm text-gray-600">Schedule routine health checks to catch issues early and ensure livestock thrive.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <h3 className="text-md font-semibold mb-2 text-stone-800">Pasture Rotation</h3>
              <p className="text-sm text-gray-600">Rotate grazing areas to maintain soil health and prevent overgrazing.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <h3 className="text-md font-semibold mb-2 text-stone-800">Seasonal Care</h3>
              <p className="text-sm text-gray-600">Adjust care routines based on seasonal changes for optimal livestock health.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <h3 className="text-md font-semibold mb-2 text-stone-800">Nutrient Management</h3>
              <p className="text-sm text-gray-600">Balance feed nutrients to support growth and prevent deficiencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>Email: support@farmpulse.com</p>
            <p>Phone: +91-93453-21457</p>
            <p>Address: 385/1,Mullai Nagar, Periyanaickenpalayam, Coimbatore, India</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Facebook</a>
              <a href="#" className="hover:underline">Twitter</a>
              <a href="#" className="hover:underline">Instagram</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="mb-2">Subscribe for the latest farming tips and updates.</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-l-md text-stone-800 focus:outline-none"
            />
            <button className="px-4 py-2 bg-white text-blue-400 rounded-r-md hover:bg-stone-200 transition-all duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-4 md:mt-0">&copy; {new Date().getFullYear()} Farm Pulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;