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
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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
      if (!isSignUp && authError.message === "Invalid login credentials") {
        setError("Incorrect email or password. Please try again.");
      } else if (!isSignUp && authError.message === "Email not confirmed") {
        setError("Your email address has not been confirmed. Please check your inbox.");
      } else {
        // For sign-up errors or other sign-in errors, you can use the default message or a generic one
        setError(authError.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      // It's important to configure the redirect URL in your Supabase project settings under Authentication -> URL Configuration.
      // The `redirectTo` path should point to the page in your app that handles password updates.
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password', // Using window.location.origin to get the base URL
      });
      if (resetError) throw resetError;
      setMessage("If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).");
    } catch (e) {
      const authError = e as AuthError;
      console.error("Password reset error:", authError); // Keep a console log for debugging
      // Avoid confirming if an email exists or not for security reasons in the message
      setMessage("If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).");
      // setError(authError.message); // Avoid showing specific errors like "User not found"
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Or specific path like '/welcome'
        },
      });
      if (googleError) throw googleError;
      // Supabase handles the redirect. If successful, onAuthStateChange in App.tsx will manage the session.
      // If there's an error before redirect (unlikely for Google OAuth), it's caught below.
    } catch (e) {
      const authError = e as AuthError;
      console.error("Google Sign In Error:", authError);
      setError(authError.message || "An error occurred during Google Sign In.");
      setIsLoading(false); // Only set loading to false if an error occurs before redirect
    }
    // No finally setIsLoading(false) here because Supabase redirects, so this component might unmount.
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-200 px-4 py-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-md w-full border border-neutral-300">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark text-center mb-8">
          Welcome
        </h1>
        <p className="mb-6 text-center text-neutral-600 text-sm sm:text-base">
          {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Sign In')}
        </p>

        <form onSubmit={isForgotPassword ? handlePasswordResetRequest : handleEmailPasswordAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150"
              placeholder="Enter Email"
            />
          </div>
          {!isForgotPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}
          {isLoading && <p className="text-neutral-500 text-sm text-center">Loading...</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 bg-gradient-deep-blue hover:opacity-90 text-white font-semibold rounded-md shadow-md hover:shadow-lg disabled:bg-neutral-400 disabled:opacity-70 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 text-sm sm:text-base" /* Changed to gradient, adjusted hover */
          >
            {isLoading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Sign Up' : 'Sign In'))}
          </button>
        </form>

        {!isForgotPassword && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-5 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold rounded-md shadow-md border border-neutral-300 disabled:bg-neutral-100 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center justify-center text-sm sm:text-base"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Sign in with Google
            </button>
          </>
        )}

        <div className="mt-6 text-center">
          {isForgotPassword ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setError(null);
                setMessage(null);
              }}
              className="text-sm text-accent hover:text-accent-dark underline"
            >
              Back to Sign in
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setMessage(null);
                }}
                className="text-sm text-accent hover:text-accent-dark underline mb-2 sm:mb-0"
              >
                {isSignUp ? 'Already have Account?' : 'Sign Up'}
              </button>
              {!isSignUp && (
                  <button
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError(null);
                      setMessage(null);
                    }}
                    className="text-sm text-accent hover:text-accent-dark underline"
                  >
                    Forgot Password?
                  </button>
              )}
            </div>
          )}
        </div>

      </div>
      <div className="mt-8 text-xs text-neutral-600 text-center"> {/* Slightly darker text for footer */}
        &copy; {new Date().getFullYear()} MZM News Writer
      </div>
    </div>
  );
};

export default LoginScreen;
