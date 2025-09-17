// src/components/SolutionsTab.tsx
import React, { useEffect, useState } from "react";
import API from "../lib/api"; // Axios instance
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  _id: string;
  text: string;
  likes?: string[];
  likesCount?: number;
}

interface Solution {
  _id: string;
  title: string;
  executive_summary: string;
  primary_approach: string;
  detailed_description: string;
  expected_impact: string;
  comments?: Comment[];
  user_id?: { name: string; email: string };
  createdAt?: string;
}

interface Props {
  challengeId: string;
}

const SolutionsTab: React.FC<Props> = ({ challengeId }) => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(
    null
  );
  const [commentsMap, setCommentsMap] = useState<{ [key: string]: string }>({});

  const fetchSolutions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`api/solutions/challenge/${challengeId}`);
      setSolutions(res.data);
    } catch (err: any) {
      console.error("Error fetching solutions:", err);
      setError(err.response?.data?.error || "Failed to fetch solutions");
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (challengeId) fetchSolutions();
  }, [challengeId]);

  const handleCommentChange = (solutionId: string, value: string) => {
    setCommentsMap((prev) => ({ ...prev, [solutionId]: value }));
  };

  const handleAddComment = async (solutionId: string) => {
    const text = commentsMap[solutionId]?.trim();
    if (!text) return;

    try {
      const res = await API.post(`api/solutions/${solutionId}/comments`, {
        text,
      });
      setSolutions((prev) =>
        prev.map((sol) =>
          sol._id === solutionId
            ? { ...sol, comments: [...(sol.comments || []), res.data] }
            : sol
        )
      );
      setCommentsMap((prev) => ({ ...prev, [solutionId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

 const handleLikeComment = (solutionId: string, commentId: string) => {
  setSolutions((prev) =>
    prev.map((sol) =>
      sol._id === solutionId
        ? {
            ...sol,
            comments: sol.comments?.map((c) =>
              c._id === commentId
                ? { ...c, likesCount: (c.likesCount || 0) + 1 }
                : c
            ),
          }
        : sol
    )
  );
};

  if (loading)
    return (
      <p className="text-center text-muted-foreground">Loading solutions...</p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!solutions.length)
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No solutions yet. Be the first to submit!</p>
        <Link
          to={`/solution/submit/${challengeId}`}
          className="inline-block mt-4"
        >
          <Button>Submit Your Solution</Button>
        </Link>
      </div>
    );

  return (
    <div className="space-y-4">
      {solutions.map((sol) => (
        <Card key={sol._id} className="p-4">
          <CardHeader>
            <CardTitle>{sol.title}</CardTitle>
            {sol.user_id && (
              <p className="text-sm text-muted-foreground">
                Submitted by {sol.user_id.name} ({sol.user_id.email}) on{" "}
                {sol.createdAt && new Date(sol.createdAt).toLocaleDateString()}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sol.executive_summary}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => setSelectedSolution(sol)}>
                View Details
              </Button>
            </div>

            {/* Comments */}
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentsMap[sol._id] || ""}
                onChange={(e) => handleCommentChange(sol._id, e.target.value)}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAddComment(sol._id)}
              >
                Comment
              </Button>

              {sol.comments?.map((c) => (
                <div
                  key={c._id}
                  className="p-2 border rounded-lg flex justify-between items-center"
                >
                  <p>{c.text}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLikeComment(sol._id, c._id)}
                  >
                    👍 {c.likesCount || 0}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Dialog for selected solution */}
      <Dialog
        open={!!selectedSolution}
        onOpenChange={() => setSelectedSolution(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSolution?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Executive Summary:</strong>{" "}
              {selectedSolution?.executive_summary}
            </p>
            <p>
              <strong>Primary Approach:</strong>{" "}
              {selectedSolution?.primary_approach}
            </p>
            <p>
              <strong>Detailed Description:</strong>{" "}
              {selectedSolution?.detailed_description}
            </p>
            <p>
              <strong>Expected Impact:</strong>{" "}
              {selectedSolution?.expected_impact}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SolutionsTab;
