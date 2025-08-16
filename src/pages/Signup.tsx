import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const { VITE_API_BASE_URL } = import.meta.env;
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const createUserInBackend = async (name: string) => {
    if (!auth.currentUser) return;

    const idToken = await auth.currentUser.getIdToken();

    await axios.post(
      `${VITE_API_BASE_URL}/api/users`,
      {
        name,
        skills: [],
        achievements: [],
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
  };

const logFirebaseToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken( true);
    console.log("Firebase ID Token:", idToken);
  }
};

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!displayName.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      // 1. Firebase signup
      await createUserWithEmailAndPassword(auth, email, password);

      // 2. Update display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }

      // 3. Create user in backend DB (MongoDB)
      await createUserInBackend(displayName);

      // 4. Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };


  // Google sign-up (same flow)
  const handleGoogleSignup = async () => {
    setError("");
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // After Google login, create user in backend
      if (auth.currentUser) {
        await createUserInBackend(auth.currentUser.displayName || "");
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Google sign-up failed");
    } finally {
      setLoading(false);
    }
    
    
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Name</label>
          <Input
            id="name"
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <div className="my-4 flex items-center">
        <hr className="flex-grow border-muted-foreground" />
        <span className="mx-2 text-muted-foreground">OR</span>
        <hr className="flex-grow border-muted-foreground" />
      </div>

      <Button
        onClick={handleGoogleSignup}
        variant="outline"
        className="w-full flex items-center justify-center space-x-2"
        disabled={loading}
      >
        <FcGoogle size={20} />
        <span>Sign up with Google</span>
      </Button>

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default Signup;
