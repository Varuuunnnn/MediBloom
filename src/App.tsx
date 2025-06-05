import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
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
        // First check if the user exists in the patients table
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (patientError || !patientData) {
          // If there's an error or no patient record exists, sign out the user
          await supabase.auth.signOut();
          setSession(null);
          return;
        }

        // Only check onboarding if the patient record exists
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;