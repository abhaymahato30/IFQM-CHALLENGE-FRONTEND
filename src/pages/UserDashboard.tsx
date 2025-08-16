import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import {
  TrendingUp,
  Award,
  Target,
  Star,
  AlertCircle,
} from "lucide-react";

// -------------------------
// Types (same shape you used)
// -------------------------
type Achievement = { title?: string } | string;

interface DashboardUser {
  name?: string;
  email?: string;
  is_verified?: boolean;
  active_challenges?: number;
  solutions_submitted?: number;
  rewards_earned?: number | string;
  avg_rating?: number | string;
  skills?: string[];
  achievements?: Achievement[];
}

interface ChallengeType {
  id?: string | number;
  _id?: string; // in case backend returns _id
  title: string;
  sector?: string;
  status?: string;
  urgency?: string;
  postedDate?: string;
  solutions?: number;
  views?: number;
  bookmarks?: number;
  organization?: string;
  reward?: string;
}

interface SolutionType {
  title: string;
  challengeTitle?: string;
  challengeSector?: string;
  status: string;
  submittedDate?: string;
  reward?: string;
}

// -------------------------
// Helpers
// -------------------------
const API_BASE = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";
const coerceNumber = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const achievementTitle = (a: Achievement) => (typeof a === "string" ? a : a?.title ?? "");

// -------------------------
// Component
// -------------------------
const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [myChallenges, setMyChallenges] = useState<ChallengeType[]>([]);
  const [mySolutions, setMySolutions] = useState<SolutionType[]>([]);
  // const [bookmarkedChallenges, setBookmarkedChallenges] = useState<ChallengeType[]>([]);

  // central fetcher that waits for Firebase auth, gets token, calls APIs
  useEffect(() => {
    const auth = getAuth();
    console.log("🔧 Dashboard mounted. Subscribing to Firebase auth…");

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log("🔔 onAuthStateChanged:", fbUser);

      if (!fbUser) {
        setError("No authenticated Firebase user found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        await fetchAllForUser(fbUser, false); // normal fetch
      } catch (err: any) {
        console.error("❌ Initial fetch failed:", err?.response?.data || err?.message);

        // If unauthorized, force refresh token once and retry
        const status = err?.response?.status;
        if (status === 401) {
          try {
            console.log("🔁 401 from API — forcing token refresh and retry…");
            await fetchAllForUser(fbUser, true);
          } catch (err2: any) {
            console.error("❌ Retry fetch failed:", err2?.response?.data || err2?.message);
            setError(err2?.message || "Failed to load user data");
          }
        } else {
          setError(err?.message || "Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log("🧹 Unsubscribe onAuthStateChanged");
      unsubscribe();
    };
  }, []);

  const fetchAllForUser = async (fbUser: FirebaseUser, forceRefresh: boolean) => {
    // get token (optionally force refresh)
    const idToken = await fbUser.getIdToken(forceRefresh);
    console.log("🟢 Firebase ID token obtained:", idToken);

    // PROFILE
    console.log("📡 GET", `${API_BASE}/api/users/profile`);
    const profileRes = await axios.get(`${API_BASE}/api/users/profile`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    console.log("✅ profile:", profileRes.data);
    // support either {success, data} or raw doc
    const profileData: DashboardUser = (profileRes.data?.data ?? profileRes.data) as DashboardUser;
    setUser(profileData);

    // PARALLEL TABS
    console.log("📡 GET", `${API_BASE}/api/users/my-challenges`);
    console.log("📡 GET", `${API_BASE}/api/users/my-solutions`);
    // console.log("📡 GET", `${API_BASE}/api/users/bookmarks`);
    const [challengesRes, solutionsRes] = await Promise.all([
      axios.get(`${API_BASE}/api/users/my-challenges`, { headers: { Authorization: `Bearer ${idToken}` } }),
      axios.get(`${API_BASE}/api/users/my-solutions`, { headers: { Authorization: `Bearer ${idToken}` } }),
      // axios.get(`${API_BASE}/api/users/bookmarks`, { headers: { Authorization: `Bearer ${idToken}` } }),
    ]);

    console.log("✅ challenges:", challengesRes.data);
    console.log("✅ solutions:", solutionsRes.data);
    // console.log("✅ bookmarks:", bookmarksRes.data);

    setMyChallenges(Array.isArray(challengesRes.data) ? challengesRes.data : []);
    setMySolutions(Array.isArray(solutionsRes.data) ? solutionsRes.data : []);
    
  };

  // Derived stats (safe coercion)
  const stats = useMemo(() => {
    return {
      active: coerceNumber(user?.active_challenges),
      submitted: coerceNumber(user?.solutions_submitted),
      rewards: coerceNumber(user?.rewards_earned),
      avgRating: coerceNumber(user?.avg_rating),
    };
  }, [user]);

  // -------------------------
  // Loading State
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent>
                  <Skeleton className="h-8 w-8 mx-auto mb-2" />
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // Error / Not logged in
  // -------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // Main UI (unchanged layout)
  // -------------------------
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || "Innovator"}!</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Track your challenges, solutions, and community impact
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent>
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active Challenges</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.submitted}</div>
              <div className="text-sm text-muted-foreground">Solutions Submitted</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <Award className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">
                ${stats.rewards.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Rewards Earned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">My Challenges</TabsTrigger>
            <TabsTrigger value="solutions">My Solutions</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview (optional – simple greeting) */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your latest activity at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Keep pushing! 🚀
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges">
            <h2 className="text-2xl font-bold mb-4">My Challenges</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {myChallenges.length === 0 && <p>No challenges found</p>}
              {myChallenges.map((c, idx) => {
                const key = (c as any)._id || c.id || idx;
                return (
                  <Card key={key}>
                    <CardHeader>
                      <Badge variant={c.status === "Active" ? "default" : "secondary"}>
                        {c.status || "—"}
                      </Badge>
                      <CardTitle>{c.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <span>Solutions: {c.solutions || 0}</span>
                        <span>Views: {c.views || 0}</span>
                      </div>
                      <Link to={`/challenge/${(c as any)._id || c.id || ""}`}>
                        <Button className="mt-2 w-full">View Challenge</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Solutions */}
          <TabsContent value="solutions">
            <h2 className="text-2xl font-bold mb-4">My Solutions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {mySolutions.length === 0 && <p>No solutions found</p>}
              {mySolutions.map((s, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <Badge variant="default">{s.status || "Submitted"}</Badge>
                    <CardTitle>{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>For: {s.challengeTitle || "—"}</div>
                    <div>Submitted: {s.submittedDate || "—"}</div>
                    <div>Reward: {s.reward || "—"}</div>
                    <Button className="mt-2 w-full">View Feedback</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

       

          {/* Profile */}
          <TabsContent value="profile">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>Verified: {user?.is_verified ? "Yes" : "No"}</div>
                  <div>Skills: {user?.skills?.join(", ") || "N/A"}</div>
                  <div className="mt-2">
                    Achievements:{" "}
                    {user?.achievements?.length
                      ? user.achievements.map((a, i) => (
                          <Badge key={i} className="mr-1">
                            {achievementTitle(a)}
                          </Badge>
                        ))
                      : "None"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
