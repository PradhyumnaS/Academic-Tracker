"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Award, BookOpen, Calendar, LogOut, RefreshCw, Search, Settings, User, Users } from 'lucide-react';
import Link from 'next/link';

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
const db = getFirestore(app);

interface UserData {
  patents?: string;
  publications?: string;
  conferences?: string;
  events?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          if (currentUser.email) {
            await fetchUserContributions(currentUser.email);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserContributions = async (username: string) => {
    try {
      const docRef = doc(db, "contribution", username);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
      setUserData(null);
    }
  };

  const refreshData = async () => {
    if (user && user.displayName) {
      setIsRefreshing(true);
      await fetchUserContributions(user.displayName);
      setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl text-amber-900">ContributionTracker</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-amber-500" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="pl-10 pr-3 py-2 border border-amber-200 rounded-lg bg-amber-50/50 placeholder-amber-400 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              
              <button 
                onClick={refreshData}
                className="p-2 rounded-full text-amber-700 hover:bg-amber-100 transition-colors"
                title="Refresh data"
              >
                <RefreshCw 
                  size={20} 
                  className={`${isRefreshing ? 'animate-spin' : ''}`} 
                />
              </button>
              
              <div className="relative ml-3">
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-amber-900">{user?.email}</p>
                    <p className="text-xs text-amber-600">{user?.email}</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full text-amber-700 hover:bg-amber-100 transition-colors"
                    title="Log out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 rounded-xl shadow-lg p-6 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.email?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-amber-100">
              Track and manage your academic contributions all in one place.
            </p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-amber-200">
          <div className="flex overflow-x-auto space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'patents', label: 'Patents', icon: Award },
              { id: 'publications', label: 'Publications', icon: BookOpen },
              { id: 'conferences', label: 'Conferences', icon: Calendar },
              { id: 'events', label: 'Events', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-600 text-amber-800'
                    : 'border-transparent text-amber-600 hover:text-amber-800 hover:border-amber-300'
                }`}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="space-y-8">
          {!userData && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 text-center">
              <h2 className="text-xl font-semibold text-amber-900 mb-2">No contribution data found</h2>
              <p className="text-amber-700">
                We couldn't find any contribution data for your account. Please add some contributions or contact support.
              </p>
            </div>
          )}
          
          {userData && activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Patents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-amber-900">Patents</h2>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                {userData?.patents ? (
                  <>
                    <div className="space-y-2">
                      {userData.patents
                        .split(/\\n/)
                        .filter(item => item.trim().length > 0)
                        .slice(0, 3)
                        .map((patent, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg shadow-sm border border-amber-100 mb-2">
                            <p className="text-amber-900 text-sm">
                              {patent.trim()}
                            </p>
                          </div>
                        ))}
                    </div>
                    {userData.patents.split(/\\n/).filter(item => item.trim().length > 0).length > 3 && (
                      <button 
                        onClick={() => setActiveTab('patents')} 
                        className="text-amber-600 hover:text-amber-800 text-sm mt-2 flex items-center"
                      >
                        View all patents ({userData.patents.split(/\\n/).filter(item => item.trim().length > 0).length - 3} more)
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-amber-900">No patent information available</p>
                )}
              </div>
            </div>
            
            {/* Publications */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-amber-900">Publications</h2>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                {userData?.publications ? (
                  <>
                    <div className="space-y-2">
                      {userData.publications
                        .split(/\\n/)
                        .filter(item => item.trim().length > 0)
                        .slice(0, 3)
                        .map((publication, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg shadow-sm border border-amber-100 mb-2">
                            <p className="text-amber-900 text-sm">
                              {publication.trim()}
                            </p>
                          </div>
                        ))}
                    </div>
                    {userData.publications.split(/\\n/).filter(item => item.trim().length > 0).length > 3 && (
                      <button 
                        onClick={() => setActiveTab('publications')} 
                        className="text-amber-600 hover:text-amber-800 text-sm mt-2 flex items-center"
                      >
                        View all publications ({userData.publications.split(/\\n/).filter(item => item.trim().length > 0).length - 3} more)
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-amber-900">No publication information available</p>
                )}
              </div>
            </div>
            
            {/* Conferences */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-amber-900">Conferences</h2>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                {userData?.conferences ? (
                  <>
                    <div className="space-y-2">
                      {userData.conferences
                        .split(/\\n/)
                        .filter(item => item.trim().length > 0)
                        .slice(0, 3)
                        .map((conference, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg shadow-sm border border-amber-100 mb-2">
                            <p className="text-amber-900 text-sm">
                              {conference.trim()}
                            </p>
                          </div>
                        ))}
                    </div>
                    {userData.conferences.split(/\\n/).filter(item => item.trim().length > 0).length > 3 && (
                      <button 
                        onClick={() => setActiveTab('conferences')} 
                        className="text-amber-600 hover:text-amber-800 text-sm mt-2 flex items-center"
                      >
                        View all conferences ({userData.conferences.split(/\\n/).filter(item => item.trim().length > 0).length - 3} more)
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-amber-900">No conference information available</p>
                )}
              </div>
            </div>
            
            {/* Events */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-amber-900">Events</h2>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                {userData?.events ? (
                  <>
                    <div className="space-y-2">
                      {userData.events
                        .split(/\\n/)
                        .filter(item => item.trim().length > 0)
                        .slice(0, 3)
                        .map((event, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg shadow-sm border border-amber-100 mb-2">
                            <p className="text-amber-900 text-sm">
                              {event.trim()}
                            </p>
                          </div>
                        ))}
                    </div>
                    {userData.events.split(/\\n/).filter(item => item.trim().length > 0).length > 3 && (
                      <button 
                        onClick={() => setActiveTab('events')} 
                        className="text-amber-600 hover:text-amber-800 text-sm mt-2 flex items-center"
                      >
                        View all events ({userData.events.split(/\\n/).filter(item => item.trim().length > 0).length - 3} more)
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-amber-900">No event information available</p>
                )}
              </div>
            </div>
          </div>
        )}
          
          {userData && activeTab === 'patents' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Your Patents</h2>
            <div className="p-6 bg-amber-50 rounded-lg">
              {userData?.patents ? (
                <div className="space-y-4">
                  {userData.patents
                    .split(/\\n/) 
                    .filter(item => item.trim().length > 0)
                    .map((patent, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                        <p className="text-amber-900">
                          {patent.trim()}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-amber-900">No patent information available</p>
              )}
            </div>
          </div>
        )}
          
          {userData && activeTab === 'publications' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Your Publications</h2>
            <div className="p-6 bg-amber-50 rounded-lg">
              {userData?.publications ? (
                <div className="space-y-4">
                  {userData.publications
                    .split(/\\n/) 
                    .filter(item => item.trim().length > 0)
                    .map((publication, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                        <p className="text-amber-900">
                          {publication.trim()}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-amber-900">No publication information available</p>
              )}
            </div>
          </div>
        )}
          
          {userData && activeTab === 'conferences' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Your Conferences</h2>
            <div className="p-6 bg-amber-50 rounded-lg">
              {userData?.conferences ? (
                <div className="space-y-4">
                  {userData.conferences
                    .split(/\\n/) 
                    .filter(item => item.trim().length > 0)
                    .map((conference, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                        <p className="text-amber-900">
                          {conference.trim()}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-amber-900">No conference information available</p>
              )}
            </div>
          </div>
        )}
          
          {userData && activeTab === 'events' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Your Events</h2>
            <div className="p-6 bg-amber-50 rounded-lg">
              {userData?.events ? (
                <div className="space-y-4">
                  {userData.events
                    .split(/\\n/) 
                    .filter(item => item.trim().length > 0)
                    .map((event, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                        <p className="text-amber-900">
                          {event.trim()}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-amber-900">No event information available</p>
              )}
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;