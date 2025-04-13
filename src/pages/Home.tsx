import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, BarChart4, Settings } from "lucide-react";
import Layout from "@/components/Layout";
import ChatWidget from "@/components/chat/ChatWidget";

const Home = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-brand-light to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary mb-4">
                  Modern Guest Session Management System
                </h1>
                <p className="text-lg text-brand-muted mb-8">
                  A comprehensive solution for managing guest interactions with
                  advanced analytics, customizable chat widgets, and powerful
                  admin controls.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-brand-primary text-white hover:bg-brand-primary/90"
                    asChild
                  >
                    <Link to="/admin/guest-session-management">
                      Explore Admin Panel
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-brand-primary text-brand-primary hover:bg-brand-light"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                  alt="Dashboard visualization"
                  className="rounded-lg shadow-xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-secondary mb-4">
                Key Features
              </h2>
              <p className="text-brand-muted max-w-2xl mx-auto">
                Our platform provides everything you need to manage guest
                interactions effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={
                  <MessageSquare className="h-10 w-10 text-brand-primary" />
                }
                title="Customizable Chat Widget"
                description="Fully customizable chat interface that matches your brand identity"
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-brand-primary" />}
                title="Guest Session Tracking"
                description="Monitor and manage all guest interactions in real-time"
              />
              <FeatureCard
                icon={<BarChart4 className="h-10 w-10 text-brand-primary" />}
                title="Advanced Analytics"
                description="Comprehensive metrics and insights on guest engagement"
              />
              <FeatureCard
                icon={<Settings className="h-10 w-10 text-brand-primary" />}
                title="Admin Controls"
                description="Powerful tools to configure and manage your system"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-brand-secondary text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to enhance your guest experience?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Start managing your guest sessions more effectively today with our
              comprehensive solution.
            </p>
            <Button
              size="lg"
              className="bg-white text-brand-secondary hover:bg-brand-light"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </div>

      {/* Chat Widget */}
      <ChatWidget
        position="bottom-right"
        mode="floating"
        brandName="Guest Support"
        brandLogo="https://api.dicebear.com/7.x/avataaars/svg?seed=support"
        primaryColor="#4A6FA5"
        welcomeMessage="Hello! How can we assist you today?"
      />
    </Layout>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="bg-white border-brand-primary/10 hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-brand-secondary mb-2">
          {title}
        </h3>
        <p className="text-brand-muted">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Home;
