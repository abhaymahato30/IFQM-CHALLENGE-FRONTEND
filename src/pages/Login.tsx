import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to get and log Firebase token
  const getFirebaseToken = async (firebaseUser: FirebaseUser): Promise<string | null> => {
    try {
      const token = await firebaseUser.getIdToken(true);
      console.log("Firebase ID Token:", token); // <-- Logs the token here
      return token;
    } catch (error) {
      console.error("Failed to get Firebase token:", error);
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get and log token after login
      const token = await getFirebaseToken(userCredential.user);
      if (!token) {
        setError("Failed to retrieve authentication token");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get and log token after Google login
      const token = await getFirebaseToken(result.user);
      if (!token) {
        setError("Failed to retrieve authentication token");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="my-4 flex items-center">
        <hr className="flex-grow border-muted-foreground" />
        <span className="mx-2 text-muted-foreground">OR</span>
        <hr className="flex-grow border-muted-foreground" />
      </div>

      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full flex items-center justify-center space-x-2"
        disabled={loading}
      >
        <FcGoogle size={20} />
        <span>Sign in with Google</span>
      </Button>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default Login;
