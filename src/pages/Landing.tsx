import React from 'react';
import { Activity, Heart, Shield, Clock, Users, LineChart as ChartLine, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const Landing = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [isDark, setIsDark] = useDarkMode();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const testimonials = [
    {
      quote: "MediBloom has transformed how I manage my health. The medication reminders and vital tracking features have made it so much easier to stay on top of my health journey.",
      name: "Sarah Johnson",
      role: "Patient since 2024",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
    },
    {
      quote: "As someone managing chronic conditions, having all my health data in one place has been invaluable. The interface is intuitive and the support is excellent.",
      name: "Michael Chen",
      role: "Patient since 2023",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
    },
    {
      quote: "The ability to track my recovery progress and share it with my healthcare team has made a huge difference in my post-surgery journey.",
      name: "Emma Rodriguez",
      role: "Patient since 2024",
      image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-b from-primary-50 to-white'}`}>
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className={`h-8 w-8 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
              <span className={`ml-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>MediBloom</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={onGetStarted}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isDark
                    ? 'text-gray-900 bg-primary-400 hover:bg-primary-300'
                    : 'text-white bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 pt-20 pb-24 text-center"
        >
          <h1 className={`text-5xl md:text-6xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Personal Health Assistant
          </h1>
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your health journey, manage medications, and stay connected with your care team - all in one secure platform.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
              isDark
                ? 'text-gray-900 bg-primary-400 hover:bg-primary-300'
                : 'text-white bg-primary-600 hover:bg-primary-700'
            }`}
          >
            Start Your Health Journey
          </motion.button>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Comprehensive Health Management
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: "Vital Signs Tracking",
                description: "Monitor your blood pressure, heart rate, and other vital signs with easy-to-read charts and trends."
              },
              {
                icon: Clock,
                title: "Medication Reminders",
                description: "Never miss a dose with smart medication reminders and scheduling."
              },
              {
                icon: Shield,
                title: "Secure Health Records",
                description: "Your health data is protected with enterprise-grade security and encryption."
              },
              {
                icon: Users,
                title: "Care Team Connection",
                description: "Stay connected with your healthcare providers and caregivers in real-time."
              },
              {
                icon: ChartLine,
                title: "Progress Tracking",
                description: "Track your recovery progress and health improvements over time."
              },
              {
                icon: Activity,
                title: "Health Analytics",
                description: "Get insights into your health patterns with advanced analytics and reporting."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} isDark={isDark} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Patient Success Stories
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <p className={`text-lg italic mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-primary-900' : 'bg-primary-600'}`}>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already managing their health journey with MediBloom.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
                isDark
                  ? 'bg-white text-primary-900 hover:bg-gray-100'
                  : 'bg-white text-primary-600 hover:bg-gray-100'
              }`}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-900'} text-white py-12`}>
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

const FeatureCard = ({ icon: Icon, title, description, isDark }: { icon: any, title: string, description: string, isDark: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`rounded-xl p-8 text-center transition-shadow duration-200 ${
      isDark
        ? 'bg-gray-800 hover:bg-gray-700'
        : 'bg-gray-50 hover:shadow-lg'
    }`}
  >
    <div className={`inline-block p-3 rounded-lg mb-6 ${
      isDark ? 'bg-gray-700 text-primary-400' : 'bg-primary-100 text-primary-600'
    }`}>
      <Icon className="h-8 w-8" />
    </div>
    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
      {description}
    </p>
  </motion.div>
);

export default Landing;