import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Adjusted path
import { AuthError } from '@supabase/supabase-js';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For messages like 'Check your email'
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailPasswordAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          // This often indicates email confirmation is pending for some providers or settings
          setMessage('Signup successful, but confirmation might be required. Please check your email if you used a new email provider.');
        } else if (data.session) {
           setMessage('Signup successful! You are now logged in.');
          // Session is active, onAuthStateChange in App.tsx will handle redirect
        } else {
          // Default message if user needs to confirm email
           setMessage('Signup successful! Please check your email to confirm your account.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        // Login success will be handled by onAuthStateChanged in App.tsx
      }
    } catch (e) {
      const authError = e as AuthError;
      setError(authError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (oauthError) throw oauthError;
      // OAuth flow will redirect; onAuthStateChange in App.tsx will handle it
    } catch (e) {
      const authError = e as AuthError;
      setError(authError.message);
    } finally {
      setIsLoading(false); // May not be reached if redirect happens quickly
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f5f2]" style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}>
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full border border-neutral-200">
        <h1 className="text-3xl font-bold mb-4 text-center" style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}>
          MZM News Writer
        </h1>
        <p className="mb-6 text-center text-neutral-700" style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}>
          {isSignUp ? 'Create an account' : 'Sign in to your account'}
        </p>

        <form onSubmit={handleEmailPasswordAuth}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // Supabase default minimum password length
              className="w-full px-3 py-2 border border-neutral-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}
          {message && <p className="mb-4 text-green-600 text-sm text-center">{message}</p>}
          {isLoading && <p className="mb-4 text-neutral-600 text-sm text-center">Loading...</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold rounded shadow-md disabled:bg-neutral-400 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-sm text-neutral-600 hover:text-neutral-800 underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-neutral-300"></div>
          <span className="mx-4 text-neutral-500 text-sm">OR</span>
          <div className="flex-grow border-t border-neutral-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-neutral-300 rounded bg-white hover:bg-neutral-100 transition text-lg font-semibold text-neutral-800 shadow-sm disabled:opacity-70"
          style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-6 w-6" />
          Sign in with Google
        </button>
      </div>
      <div className="mt-8 text-xs text-neutral-400 text-center">
        &copy; {new Date().getFullYear()} MZM News Writer
      </div>
    </div>
  );
};

export default LoginScreen;
