import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Activity } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const Auth = () => {
  const [isDark] = useDarkMode();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const extractErrorMessage = (error: any): string => {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (error.message) {
      return error.message;
    }

    if (typeof error.body === 'string') {
      try {
        const parsedBody = JSON.parse(error.body);
        if (parsedBody.message) {
          return parsedBody.message;
        }
      } catch (e) {
        // Parsing failed, fall through to default
      }
    }

    return 'An unexpected error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;
        
        if (!user) {
          throw new Error('Signup failed - no user returned');
        }

        let retryCount = 0;
        const maxRetries = 3;
        let patientCreated = false;

        while (retryCount < maxRetries && !patientCreated) {
          const { error: insertError } = await supabase.from('patients').insert({
            id: user.id,
            email,
            full_name: fullName,
            date_of_birth: dateOfBirth,
          });

          if (!insertError) {
            patientCreated = true;
          } else {
            if (!insertError.message.includes('duplicate key')) {
              throw insertError;
            }
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (!patientCreated) {
          throw new Error('Failed to create patient record after multiple attempts');
        }

        setSuccessMessage('Registration successful! Please sign in with your credentials.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setFullName('');
        setDateOfBirth('');
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
      if (!isLogin) {
        await supabase.auth.signOut();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${
      isDark ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Activity className={`h-12 w-12 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          MediBloom
        </h2>
        <p className={`mt-2 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Your Virtual Nurse
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`py-8 px-4 shadow sm:rounded-lg sm:px-10 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="fullName" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        isDark
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Date of Birth
                  </label>
                  <div className="mt-1">
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        isDark
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    isDark
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    isDark
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                />
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Password must be at least 6 characters long
                </p>
              </div>
            </div>

            {error && (
              <div className={`p-4 rounded-md ${
                isDark
                  ? 'bg-red-900/20 border border-red-900'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                  isDark
                    ? 'bg-primary-500 hover:bg-primary-600'
                    : 'bg-primary-600 hover:bg-primary-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMessage('');
                setEmail('');
                setPassword('');
                setFullName('');
                setDateOfBirth('');
              }}
              className={`w-full text-center text-sm ${
                isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'
              }`}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;