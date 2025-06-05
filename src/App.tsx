import React, { useEffect, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const checkUserAndOnboarding = async () => {
      if (session?.user) {
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (patientError || !patientData) {
          await supabase.auth.signOut();
          setSession(null);
          return;
        }

        const { data: detailsData } = await supabase
          .from('patient_details')
          .select('*')
          .eq('patient_id', session.user.id)
          .maybeSingle();
        
        setHasCompletedOnboarding(!!detailsData);
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

  const renderPage = () => {
    switch (currentPage) {
      case 'health-metrics':
        return <HealthMetrics />;
      case 'appointments':
        return <Appointments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;