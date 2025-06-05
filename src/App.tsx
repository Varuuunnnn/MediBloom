import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import HealthMetrics from './pages/HealthMetrics';
import Appointments from './pages/Appointments';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Landing from './pages/Landing';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize session state
    const initializeSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
          setSession(null);
          return;
        }
        setSession(initialSession);
      } catch (err) {
        console.error('Unexpected error during session fetch:', err);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    initializeSession();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkUserAndOnboarding = async () => {
      if (session?.user) {
        try {
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (patientError) {
            console.error('Error fetching patient data:', patientError.message);
            await supabase.auth.signOut();
            setSession(null);
            return;
          }

          if (!patientData) {
            console.warn('No patient record found');
            await supabase.auth.signOut();
            setSession(null);
            return;
          }

          const { data: detailsData, error: detailsError } = await supabase
            .from('patient_details')
            .select('*')
            .eq('patient_id', session.user.id)
            .maybeSingle();
          
          if (detailsError) {
            console.error('Error fetching patient details:', detailsError.message);
          }

          setHasCompletedOnboarding(!!detailsData);
        } catch (err) {
          console.error('Unexpected error during user check:', err);
          await supabase.auth.signOut();
          setSession(null);
        }
      }
    };

    checkUserAndOnboarding();
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session && !showAuth) {
    return <Landing onGetStarted={() => setShowAuth(true)} />;
  }

  if (!session) {
    return <Auth />;
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onNavigate={(page) => navigate(`/${page}`)} currentPage={location.pathname.substring(1) || 'dashboard'} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-metrics" element={<HealthMetrics />} />
              <Route path="/appointments" element={<Appointments />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;