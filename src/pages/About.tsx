import React from "react";
import { Globe, Shield, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">InnovateTogether</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect organizations with innovative minds. Post operational challenges, contribute solutions, and drive meaningful change through collaborative problem-solving.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">Post a Challenge</Button>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">Browse Challenges</Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-blue-600" />}
              title="Global Community"
              description="Connect with thousands of innovators, students, and professionals worldwide. Leverage diverse perspectives for breakthrough solutions."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Secure & Transparent"
              description="Clear IP policies, secure submission processes, and transparent review systems. Your ideas and challenges are protected."
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-blue-600" />}
              title="Meaningful Rewards"
              description="From monetary rewards to partnership opportunities and recognition. Your contributions create real value and impact."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <StatCard value="500+" label="Active Challenges" />
            <StatCard value="10000+" label="Solution Contributors" />
            <StatCard value="250+" label="Organizations" />
            <StatCard value="2 Lakhs+" label="Rewards Distributed" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of innovators solving real-world problems and creating meaningful change.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">Post Your Challenge</Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Join as Innovator</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>Browse Challenges</li>
              <li>Post Challenge</li>
              <li>Dashboard</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Guidelines</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>IP Guidelines</li>
            </ul>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 InnovateTogether. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition duration-300 text-left">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
    <h3 className="text-3xl font-bold text-blue-600 mb-2">{value}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default About;
