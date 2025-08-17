// App.tsx
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import ChallengeSubmission from "./pages/ChallengeSubmission";
import ChallengeBrowse from "./pages/ChallengeBrowse";
import ChallengeDetail from "./pages/ChallengeDetail";
import SolutionSubmission from "./pages/SolutionSubmission";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Firebase
import { auth } from "../src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        console.log("🔥 Firebase Bearer token:", token);
      } else {
        console.log("⚠️ No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/challenge/submit" element={<ChallengeSubmission />} />
            <Route path="/challenges" element={<ChallengeBrowse />} />

            {/* Challenge details */}
            <Route path="/challenge/:id" element={<ChallengeDetail />} />

            {/* Fallback if challenge ID is saved in localStorage */}
            <Route
              path="/challenge"
              element={
                localStorage.getItem("challengeId") ? (
                  <Navigate
                    to={`/challenge/${localStorage.getItem("challengeId")}`}
                  />
                ) : (
                  <NotFound />
                )
              }
            />

            <Route
              path="/solution/submit/:challengeId"
              element={<SolutionSubmission />}
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
