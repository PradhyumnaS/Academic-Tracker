"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, BookOpen, Calendar, Menu, User, Users } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-amber-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="font-bold text-xl text-amber-900">
                ContributionTracker
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="#features" className="text-amber-800 hover:text-amber-600 transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-amber-800 hover:text-amber-600 transition-colors">
                Testimonials
              </Link>
              <Link href="#" className="text-amber-800 hover:text-amber-600 transition-colors">
                About
              </Link>
              
              {loading ? (
                <div className="w-24 h-10 bg-amber-100 rounded-lg animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/dashboard" 
                    className="text-amber-800 hover:text-amber-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="text-amber-800 focus:outline-none">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6 tracking-tight">
              Track your academic contributions with ease
            </h1>
            <p className="text-xl text-amber-800/80 mb-8 max-w-2xl">
              Seamlessly organize and showcase your patents, publications, conferences, 
              and events in one beautiful platform.
            </p>
            {user ? (
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors group"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors group"
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            )}
          </div>
        </div>
        
        {/* Abstract floating shapes */}
        <div className="absolute right-0 -bottom-20 md:bottom-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-300/20 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute right-[10%] top-[20%] w-32 h-32 bg-amber-200/30 rounded-full blur-xl"></div>
        <div className="absolute left-[5%] bottom-[15%] w-24 h-24 bg-orange-200/30 rounded-full blur-xl"></div>
      </section>

      {/* Features */}
      <section id='features' className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Everything you need in one place</h2>
            <p className="text-lg text-amber-700/70 max-w-2xl mx-auto">
              Our platform offers a comprehensive solution for tracking and showcasing your academic contributions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="text-amber-600" size={28} />,
                title: "Patents",
                description: "Catalogue and showcase your innovative patents with detailed information and status tracking"
              },
              {
                icon: <BookOpen className="text-amber-600" size={28} />,
                title: "Publications",
                description: "Track your research papers, journal articles, and academic publications in one organized space"
              },
              {
                icon: <Calendar className="text-amber-600" size={28} />,
                title: "Conferences",
                description: "Keep record of all conferences you've attended or presented at with important details"
              },
              {
                icon: <Users className="text-amber-600" size={28} />,
                title: "Events",
                description: "Document academic events you've participated in or organized throughout your career"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-amber-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-amber-900 mb-2">{feature.title}</h3>
                <p className="text-amber-700/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Benefits */}
      <section id='testimonials' className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Why researchers love our platform</h2>
            <p className="text-lg text-amber-700/70">
              Designed specifically for academics, researchers, and professionals who need to showcase their contributions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform completely transformed how I organize my research output. Everything is now beautifully documented.",
                author: "Dr. Sarah Chen",
                role: "Professor of Computer Science"
              },
              {
                quote: "The ability to track all my patents and publications in one place has been invaluable for my tenure application.",
                author: "Dr. Michael Rodriguez",
                role: "Associate Professor of Engineering"
              },
              {
                quote: "I can now generate reports of my academic contributions in seconds. This used to take me days to compile manually.",
                author: "Dr. Aisha Patel",
                role: "Research Scientist"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm relative">
                <div className="absolute -top-4 left-8 text-amber-500 text-6xl">"</div>
                <p className="text-amber-800 mb-6 relative z-10 pt-4">
                  {testimonial.quote}
                </p>
                <div>
                  <h4 className="font-medium text-amber-900">{testimonial.author}</h4>
                  <p className="text-sm text-amber-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-amber-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-50 mb-6 max-w-2xl mx-auto">
            Ready to showcase your academic achievements?
          </h2>
          <p className="text-xl text-amber-100/80 mb-8 max-w-xl mx-auto">
            Join thousands of researchers who are using our platform to document their contributions
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center px-8 py-4 bg-amber-100 hover:bg-white text-amber-900 font-medium rounded-lg transition-colors group"
          >
            Sign in to your account
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-200/70 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-amber-100 mb-4">Contribution Tracker</h3>
              <p className="mb-4">Track, manage, and showcase your academic contributions in one beautiful platform.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-amber-100 mb-3">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-100 transition-colors">Patents</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Publications</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Conferences</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Events</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-amber-100 mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-100 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-amber-100 mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-100 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-800/30 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Contribution Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}