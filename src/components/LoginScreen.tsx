import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

const LoginScreen: React.FC = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // User is now signed in
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f5f2]">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full border border-neutral-200">
        <h1 className="text-3xl font-bold mb-4 text-center">
          MZM News Writer
        </h1>
        <p className="mb-6 text-center text-neutral-700">
          Sign in with your Google account to continue
        </p>
        <button
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-neutral-300 rounded bg-white hover:bg-neutral-100 transition text-lg font-semibold text-neutral-800 shadow-sm"
          onClick={handleGoogleLogin}
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
