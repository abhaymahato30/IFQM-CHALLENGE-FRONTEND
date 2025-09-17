import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";

// -------------------------
// Types
// -------------------------
interface ContactInfo {
  name: string;
  organization: string;
  email: string;
  phone?: string;
}

interface ChallengeType {
  _id: string;
  title: string;
  status: string;
  brief_description: string;
  detailed_description: string;
  category: string;
  current_state: string;
  desired_outcomes: string;
  constraints_requirements?: string;
  success_metrics?: string;
  urgency_level: string;
  region_affected?: string;
  desired_timeline: string;
  reward_type: string;
  reward_details?: string;
  ip_considerations?: string;
  tags: string[];
  views: number;
  solutions_count: number;
  posted_date: string;
  deadline?: string;
  contact_info: ContactInfo;
  createdBy?: { name?: string; email?: string };
  approvedBy?: { name?: string };
  rejectionReason?: string;
}

// -------------------------
// Component
// -------------------------
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [pendingChallenges, setPendingChallenges] = useState<ChallengeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // -------------------------
  // Fetch Firebase auth user
  // -------------------------
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setError("No authenticated user. Please login.");
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      fetchPendingChallenges(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // -------------------------
  // Fetch pending challenges
  // -------------------------
  const fetchPendingChallenges = async (fbUser: FirebaseUser) => {
    try {
      setLoading(true);
      const idToken = await fbUser.getIdToken();
      const res = await axios.get(`${API_BASE}/api/challenges/admin/pending`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      setPendingChallenges(res.data.data || []);
    } catch (err: any) {
      console.error("Error fetching pending challenges:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Approve or Reject
  // -------------------------
  const handleApprove = async (challengeId: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await axios.put(`${API_BASE}/api/challenges/${challengeId}/approve`, {}, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setPendingChallenges((prev) => prev.filter((c) => c._id !== challengeId));
    } catch (err) {
      console.error("Error approving challenge:", err);
    }
  };

  const handleReject = async (challengeId: string, reason?: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await axios.put(
        `${API_BASE}/api/challenges/${challengeId}/reject`,
        { reason: reason || "Not approved" },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      setPendingChallenges((prev) => prev.filter((c) => c._id !== challengeId));
    } catch (err) {
      console.error("Error rejecting challenge:", err);
    }
  };

  // -------------------------
  // Modal
  // -------------------------
  const openModal = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedChallenge(null);
    setIsModalOpen(false);
  };

  // -------------------------
  // Loading/Error UI
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Loading pending challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // -------------------------
  // Main UI
  // -------------------------
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Admin Panel – Pending Challenges</h1>

        {pendingChallenges.length === 0 && (
          <p className="text-muted-foreground">No pending challenges at the moment.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {pendingChallenges.map((challenge) => (
            <Card key={challenge._id}>
              <CardHeader>
                <Badge variant="secondary">{challenge.status}</Badge>
                <CardTitle>{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">
                  Posted by: {challenge.createdBy?.name || challenge.createdBy?.email || "Unknown"}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => handleApprove(challenge._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => handleReject(challenge._id)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => openModal(challenge)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ------------------------- */}
      {/* Modal for challenge details */}
      {/* ------------------------- */}
      {isModalOpen && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4"
              onClick={closeModal}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedChallenge.title}</h2>
            <p><strong>Brief Description:</strong> {selectedChallenge.brief_description}</p>
            <p><strong>Detailed Description:</strong> {selectedChallenge.detailed_description}</p>
            <p><strong>Category:</strong> {selectedChallenge.category}</p>
            <p><strong>Current State:</strong> {selectedChallenge.current_state}</p>
            <p><strong>Desired Outcomes:</strong> {selectedChallenge.desired_outcomes}</p>
            {selectedChallenge.constraints_requirements && (
              <p><strong>Constraints/Requirements:</strong> {selectedChallenge.constraints_requirements}</p>
            )}
            {selectedChallenge.success_metrics && (
              <p><strong>Success Metrics:</strong> {selectedChallenge.success_metrics}</p>
            )}
            <p><strong>Urgency Level:</strong> {selectedChallenge.urgency_level}</p>
            {selectedChallenge.region_affected && (
              <p><strong>Region Affected:</strong> {selectedChallenge.region_affected}</p>
            )}
            <p><strong>Desired Timeline:</strong> {new Date(selectedChallenge.desired_timeline).toLocaleDateString()}</p>
            <p><strong>Reward Type:</strong> {selectedChallenge.reward_type}</p>
            {selectedChallenge.reward_details && (
              <p><strong>Reward Details:</strong> {selectedChallenge.reward_details}</p>
            )}
            {selectedChallenge.ip_considerations && (
              <p><strong>IP Considerations:</strong> {selectedChallenge.ip_considerations}</p>
            )}
            <p><strong>Tags:</strong> {selectedChallenge.tags.join(", ")}</p>
            <p><strong>Posted By:</strong> {selectedChallenge.contact_info.name} ({selectedChallenge.contact_info.email})</p>
            {selectedChallenge.contact_info.organization && (
              <p><strong>Organization:</strong> {selectedChallenge.contact_info.organization}</p>
            )}
            {selectedChallenge.contact_info.phone && (
              <p><strong>Phone:</strong> {selectedChallenge.contact_info.phone}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
