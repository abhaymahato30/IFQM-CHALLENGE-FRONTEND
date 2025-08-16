
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { 
  Calendar, 
  MapPin, 
  Award, 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  Building, 
  Mail, 
  Phone,
  Share2,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const ChallengeDetail = () => {
  const { id } = useParams();
  
  // Mock data - in real app, fetch based on ID
  const challenge = {
    id: 1,
    title: "Sustainable Packaging Solutions for E-commerce",
    organization: "GreenTech Industries",
    sector: "Sustainability",
    urgency: "High",
    description: "We need innovative biodegradable packaging solutions that maintain product protection while reducing environmental impact for our e-commerce operations.",
    detailedDescription: `Our e-commerce platform ships over 100,000 packages monthly, and we're committed to reducing our environmental footprint. Current packaging solutions are either too expensive, don't provide adequate protection, or aren't truly biodegradable.

We're looking for creative solutions that can:
- Maintain product integrity during shipping
- Decompose within 6 months in standard composting conditions  
- Cost no more than 15% above current packaging
- Work with automated packaging systems
- Be suitable for a variety of product sizes and weights

This challenge represents a significant opportunity to scale sustainable packaging across the e-commerce industry.`,
    currentState: "Currently using a mix of recycled cardboard and bubble wrap. Exploring compostable alternatives but haven't found suitable options that meet all our requirements.",
    desiredOutcomes: "A packaging solution that reduces our environmental impact by 60% while maintaining customer satisfaction and cost efficiency.",
    constraints: "Must be compatible with our existing automated packaging lines. Budget constraint of 15% above current costs. Must meet shipping protection standards.",
    successMetrics: "Environmental impact reduction, cost analysis, customer satisfaction scores, packaging integrity during shipping.",
    solutions: 23,
    reward: "$15,000",
    rewardType: "Monetary",
    timeline: "3 months",
    region: "North America",
    postedDate: "2024-01-15",
    deadline: "2024-04-15",
    contact: {
      name: "Sarah Johnson",
      email: "sarah.johnson@greentech.com",
      phone: "+1 (555) 123-4567"
    },
    tags: ["sustainability", "packaging", "e-commerce", "environment", "biodegradable"],
    status: "Active",
    views: 342,
    bookmarks: 28
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Challenge link copied to clipboard!");
  };

  const handleBookmark = () => {
    toast.success("Challenge bookmarked!");
  };

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
                  <Badge variant={challenge.urgency === 'Critical' ? 'destructive' : 
                               challenge.urgency === 'High' ? 'default' : 'secondary'}>
                    {challenge.urgency}
                  </Badge>
                  <Badge variant="outline">{challenge.sector}</Badge>
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
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Link to={`/solution/submit/${challenge.id}`}>
                  <Button size="lg" className="px-8 bg-primary hover:bg-primary/90">
                    <Target className="h-4 w-4 mr-2" />
                    Submit Solution
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold">{challenge.solutions}</div>
                <div className="text-xs text-muted-foreground">Solutions</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Award className="h-5 w-5 text-secondary mx-auto mb-1" />
                <div className="text-2xl font-bold">{challenge.reward}</div>
                <div className="text-xs text-muted-foreground">Reward</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-accent mx-auto mb-1" />
                <div className="text-2xl font-bold">{challenge.timeline}</div>
                <div className="text-xs text-muted-foreground">Timeline</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold">{challenge.region}</div>
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
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Challenge Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed mb-4">
                        {challenge.description}
                      </p>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {challenge.detailedDescription}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Success Criteria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-secondary">Desired Outcomes</h4>
                          <p className="text-muted-foreground">{challenge.desiredOutcomes}</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2 text-accent">Success Metrics</h4>
                          <p className="text-muted-foreground">{challenge.successMetrics}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current State</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {challenge.currentState}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Constraints & Requirements</CardTitle>
                    </CardHeader>
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
                    <CardHeader>
                      <CardTitle>Tags & Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {challenge.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="solutions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submitted Solutions ({challenge.solutions})</CardTitle>
                      <CardDescription>
                        Solutions are reviewed by the challenge owner and our moderation team
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Solutions are visible to challenge owners and will be displayed here once submitted.</p>
                        <Link to={`/solution/submit/${challenge.id}`} className="inline-block mt-4">
                          <Button>Submit Your Solution</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
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
              {/* Key Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posted</span>
                    <span className="text-sm font-medium">{new Date(challenge.postedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <span className="text-sm font-medium">{new Date(challenge.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reward Type</span>
                    <span className="text-sm font-medium">{challenge.rewardType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bookmarked</span>
                    <span className="text-sm font-medium">{challenge.bookmarks} times</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">{challenge.contact.name}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${challenge.contact.email}`} className="text-sm text-primary hover:underline">
                        {challenge.contact.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${challenge.contact.phone}`} className="text-sm text-primary hover:underline">
                        {challenge.contact.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Take Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={`/solution/submit/${challenge.id}`}>
                    <Button className="w-full" size="lg">
                      <Target className="h-4 w-4 mr-2" />
                      Submit Solution
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={handleBookmark}>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmark Challenge
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Challenge
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
