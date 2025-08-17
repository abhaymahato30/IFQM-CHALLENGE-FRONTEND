import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { 
  Calendar, MapPin, Award, Users, Target, TrendingUp, Clock, Building, Mail, Phone,
  Share2, Bookmark, AlertTriangle, CheckCircle, Info
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const ChallengeDetail = () => {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/challenges/${id}`);
        setChallenge(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load challenge");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchChallenge();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Challenge link copied to clipboard!");
  };

  const handleBookmark = () => {
    toast.success("Challenge bookmarked!");
  };

  if (loading) return <p className="text-center py-16">Loading challenge...</p>;
  if (error) return <p className="text-center py-16 text-red-600">{error}</p>;
  if (!challenge) return <p className="text-center py-16">Challenge not found</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={challenge.urgency_level === 'Critical' ? 'destructive' : 
                                  challenge.urgency_level === 'High' ? 'default' : 'secondary'}>
                    {challenge.urgency_level}
                  </Badge>
                  <Badge variant="outline">{challenge.category}</Badge>
                  <Badge variant="outline" className="text-secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {challenge.status}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                  {challenge.title}
                </h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="text-lg font-medium">{challenge.organization}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBookmark}>
                  <Bookmark className="h-4 w-4 mr-2" /> Bookmark
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
                <Link to={`/solution/submit/${challenge._id}`}>
                  <Button size="lg" className="px-8 bg-primary hover:bg-primary/90">
                    <Target className="h-4 w-4 mr-2" /> Submit Solution
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold">{challenge.solutions_count || 0}</div>
                <div className="text-xs text-muted-foreground">Solutions</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Award className="h-5 w-5 text-secondary mx-auto mb-1" />
                <div className="text-2xl font-bold">{challenge.reward_details || challenge.reward_type}</div>
                <div className="text-xs text-muted-foreground">Reward</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
  <Clock className="h-5 w-5 text-accent mx-auto mb-1" />
  <div className="text-2xl font-bold">
    {challenge.desired_timeline
      ? new Date(challenge.desired_timeline).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A"}
  </div>
  <div className="text-xs text-muted-foreground">Timeline</div>
</div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold">{challenge.region_affected}</div>
                <div className="text-xs text-muted-foreground">Region</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-secondary mx-auto mb-1" />
                <div className="text-2xl font-bold">{challenge.views}</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="solutions">Solutions</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle>Challenge Overview</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed mb-4">{challenge.brief_description}</p>
                      <p className="text-base leading-relaxed text-muted-foreground">{challenge.detailed_description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Success Criteria</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-secondary">Desired Outcomes</h4>
                          <p className="text-muted-foreground">{challenge.desired_outcomes}</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2 text-accent">Success Metrics</h4>
                          <p className="text-muted-foreground">{challenge.success_metrics}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle>Current State</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed text-muted-foreground">{challenge.current_state}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Constraints & Requirements</CardTitle></CardHeader>
                    <CardContent>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-800 mb-1">Important Constraints</h4>
                            <p className="text-amber-700 text-sm">{challenge.constraints}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Tags & Categories</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {challenge.tags?.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Solutions Tab */}
                <TabsContent value="solutions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submitted Solutions ({challenge.solutions_count || 0})</CardTitle>
                      <CardDescription>
                        Solutions are reviewed by the challenge owner and our moderation team
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Solutions are visible to challenge owners and will be displayed here once submitted.</p>
                        <Link to={`/solution/submit/${challenge._id}`} className="inline-block mt-4">
                          <Button>Submit Your Solution</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Discussion Tab */}
                <TabsContent value="discussion" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Discussion & Q&A</CardTitle>
                      <CardDescription>
                        Ask questions and discuss with other contributors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start the conversation! Be the first to ask a question or share insights.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader><CardTitle>Challenge Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posted</span>
                    <span className="text-sm font-medium">{new Date(challenge.posted_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <span className="text-sm font-medium">{new Date(challenge.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reward Type</span>
                    <span className="text-sm font-medium">{challenge.reward_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bookmarked</span>
                    <span className="text-sm font-medium">{challenge.bookmarks} times</span>
                  </div>
                </CardContent>
              </Card>

              {challenge.contact_info && (
  <Card>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center mb-1">
        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">{challenge.contact_info.name}</span>
      </div>
      <div className="flex items-center mb-1">
        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
        <a href={`mailto:${challenge.contact_info.email}`} className="text-sm text-primary hover:underline">
          {challenge.contact_info.email}
        </a>
      </div>
      <div className="flex items-center mb-1">
        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
        <a href={`tel:${challenge.contact_info.phone}`} className="text-sm text-primary hover:underline">
          {challenge.contact_info.phone}
        </a>
      </div>
    </CardContent>
  </Card>
)}



              <Card>
                <CardHeader><CardTitle>Take Action</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Link to={`/solution/submit/${challenge._id}`}>
                    <Button className="w-full" size="lg">
                      <Target className="h-4 w-4 mr-2" /> Submit Solution
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={handleBookmark}>
                    <Bookmark className="h-4 w-4 mr-2" /> Bookmark Challenge
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" /> Share Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
