import React from 'react';
import { Activity, Heart, Shield, Clock, Users, ChartLine } from 'lucide-react';

const Landing = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">MediBloom</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-6 pt-20 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Your Personal Health Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Track your health journey, manage medications, and stay connected with your care team - all in one secure platform.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            Start Your Health Journey
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Comprehensive Health Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard
              icon={Heart}
              title="Vital Signs Tracking"
              description="Monitor your blood pressure, heart rate, and other vital signs with easy-to-read charts and trends."
            />
            <FeatureCard
              icon={Clock}
              title="Medication Reminders"
              description="Never miss a dose with smart medication reminders and scheduling."
            />
            <FeatureCard
              icon={Shield}
              title="Secure Health Records"
              description="Your health data is protected with enterprise-grade security and encryption."
            />
            <FeatureCard
              icon={Users}
              title="Care Team Connection"
              description="Stay connected with your healthcare providers and caregivers in real-time."
            />
            <FeatureCard
              icon={ChartLine}
              title="Progress Tracking"
              description="Track your recovery progress and health improvements over time."
            />
            <FeatureCard
              icon={Activity}
              title="Health Analytics"
              description="Get insights into your health patterns with advanced analytics and reporting."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Trusted by Patients Worldwide
            </h2>
            <blockquote className="text-xl text-gray-600 italic mb-8">
              "MediBloom has transformed how I manage my health. The medication reminders and vital tracking features have made it so much easier to stay on top of my health journey."
            </blockquote>
            <div className="flex items-center justify-center">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                alt="Sarah Johnson"
              />
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-gray-600">Patient since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already managing their health journey with MediBloom.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 text-lg font-medium text-primary-600 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-200"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-white" />
              <span className="ml-2 text-2xl font-bold">MediBloom</span>
            </div>
            <p className="text-gray-400">© 2025 MediBloom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
    <div className="inline-block p-3 bg-primary-100 rounded-lg text-primary-600 mb-6">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Landing;