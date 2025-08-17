
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { Search, Users, Target, Award, TrendingUp, Globe, Shield, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {   
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Solve Real-World <span className="text-primary">Challenges</span> Together
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect organizations with innovative minds. Post operational challenges, contribute solutions, 
              and drive meaningful change through collaborative problem-solving.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/challenge/submit">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                  <Target className="mr-2 h-5 w-5" />
                  Post a Challenge
                </Button>
              </Link>
              <Link to="/challenges">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Challenges
                </Button>
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search challenges by industry, skills, or keywords..."
                className="pl-12 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for seamless collaboration between problem-owners and innovators
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Global Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Connect with thousands of innovators, students, and professionals worldwide. 
                  Leverage diverse perspectives for breakthrough solutions.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle className="text-xl">Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Clear IP policies, secure submission processes, and transparent review systems. 
                  Your ideas and challenges are protected.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-xl">Meaningful Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  From monetary rewards to partnership opportunities and recognition. 
                  Your contributions create real value and impact.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4">Featured Challenges</h2>
              <p className="text-xl text-muted-foreground">
                Discover high-impact problems waiting for your innovative solutions
              </p>
            </div>
            <Link to="/challenges">
              <Button variant="outline" size="lg">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredChallenges.map((challenge, index) => (
              <Card key={index} className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={challenge.urgency === 'Critical' ? 'destructive' : 
                                 challenge.urgency === 'High' ? 'default' : 'secondary'}>
                      {challenge.urgency}
                    </Badge>
                    <Badge variant="outline">{challenge.sector}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {challenge.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {challenge.organization}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 line-clamp-3">{challenge.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {challenge.solutions} solutions
                    </div>
                    <div className="flex items-center text-sm text-secondary font-medium">
                      <Award className="h-4 w-4 mr-1" />
                      {challenge.reward}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Active Challenges</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg opacity-90">Solution Contributors</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">250+</div>
              <div className="text-lg opacity-90">Organizations</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <div className="text-lg opacity-90">Rewards Distributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Lightbulb className="h-16 w-16 text-secondary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of innovators solving real-world problems and creating meaningful change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/challenge/submit">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                Post Your Challenge
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
                Join as Innovator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">InnovateTogether</h3>
              <p className="text-muted-foreground">
                Connecting problem-solvers with real-world challenges for meaningful impact.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/challenges" className="hover:text-primary">Browse Challenges</Link></li>
                <li><Link to="/challenge/submit" className="hover:text-primary">Post Challenge</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">IP Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 InnovateTogether. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const featuredChallenges = [
  {
    title: "Sustainable Packaging Solutions for E-commerce",
    organization: "GreenTech Industries",
    sector: "Sustainability",
    urgency: "High",
    description: "We need innovative biodegradable packaging solutions that maintain product protection while reducing environmental impact for our e-commerce operations.",
    solutions: 23,
    reward: "₹1515K"
  },
  {
    title: "AI-Powered Quality Control System",
    organization: "Manufacturing Corp",
    sector: "Manufacturing",
    urgency: "Critical",
    description: "Develop an AI system to detect product defects in real-time on our assembly line, reducing waste and improving quality standards.",
    solutions: 31,
    reward: "₹1525K"
  },
  {
    title: "Remote Healthcare Monitoring Platform",
    organization: "HealthTech Solutions",
    sector: "Healthcare",
    urgency: "High",
    description: "Create a comprehensive platform for remote patient monitoring that integrates with existing healthcare systems and improves patient outcomes.",
    solutions: 18,
    reward: "₹1520K"
  }
];

export default Index;
