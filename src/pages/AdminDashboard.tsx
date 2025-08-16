
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Building,
  Search,
  Filter,
  Download,
  Settings
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");
  const [challengeFilter, setChallengeFilter] = useState("");
  const [solutionFilter, setSolutionFilter] = useState("");

  const handleApprove = (type: string, id: number) => {
    toast.success(`${type} approved successfully`);
  };

  const handleReject = (type: string, id: number) => {
    toast.error(`${type} rejected`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Monitor platform activity and manage content
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Challenges</p>
                    <p className="text-2xl font-bold">524</p>
                    <p className="text-xs text-secondary">+12% from last month</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">10,247</p>
                    <p className="text-xs text-secondary">+8% from last month</p>
                  </div>
                  <Users className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Solutions</p>
                    <p className="text-2xl font-bold">1,892</p>
                    <p className="text-xs text-secondary">+15% from last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
                    <p className="text-2xl font-bold">$2.1M</p>
                    <p className="text-xs text-secondary">+22% from last month</p>
                  </div>
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="solutions">Solutions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>Daily challenges and solutions over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Line type="monotone" dataKey="challenges" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="solutions" stroke="hsl(var(--secondary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Categories</CardTitle>
                    <CardDescription>Distribution by sector</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Items */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                      Pending Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm">Challenges awaiting approval</span>
                      <Badge variant="destructive">8</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm">Solutions under review</span>
                      <Badge variant="destructive">23</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm">User reports</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className="mt-1">
                          {activity.type === 'challenge' && <Target className="h-4 w-4 text-primary" />}
                          {activity.type === 'solution' && <TrendingUp className="h-4 w-4 text-secondary" />}
                          {activity.type === 'user' && <Users className="h-4 w-4 text-accent" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="challenges" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search challenges..."
                    value={challengeFilter}
                    onChange={(e) => setChallengeFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Solutions</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {challengesData.map((challenge) => (
                      <TableRow key={challenge.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{challenge.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{challenge.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{challenge.organization}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{challenge.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            challenge.status === 'Active' ? 'default' :
                            challenge.status === 'Pending' ? 'destructive' :
                            'secondary'
                          }>
                            {challenge.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{challenge.solutions}</TableCell>
                        <TableCell>{challenge.posted}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {challenge.status === 'Pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleApprove('Challenge', challenge.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject('Challenge', challenge.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            
            <TabsContent value="solutions" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search solutions..."
                    value={solutionFilter}
                    onChange={(e) => setSolutionFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Solution</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solutionsData.map((solution) => (
                      <TableRow key={solution.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{solution.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{solution.summary}</p>
                          </div>
                        </TableCell>
                        <TableCell>{solution.challenge}</TableCell>
                        <TableCell>{solution.contributor}</TableCell>
                        <TableCell>
                          <Badge variant={
                            solution.status === 'Under Review' ? 'default' :
                            solution.status === 'Approved' ? 'secondary' :
                            'destructive'
                          }>
                            {solution.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{solution.submitted}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {solution.status === 'Under Review' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleApprove('Solution', solution.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject('Solution', solution.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Monitor and manage platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">10,247</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <Building className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <div className="text-2xl font-bold">347</div>
                      <div className="text-sm text-muted-foreground">Organizations</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold">1,892</div>
                      <div className="text-sm text-muted-foreground">Active This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="organizations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Management</CardTitle>
                  <CardDescription>Monitor registered organizations and their activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Organization management features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>Detailed platform analytics and reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Advanced reporting features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Mock data
const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#ff7c7c', '#8dd1e1', '#82ca9d'];

const activityData = [
  { date: '2024-01-01', challenges: 12, solutions: 45 },
  { date: '2024-01-02', challenges: 8, solutions: 38 },
  { date: '2024-01-03', challenges: 15, solutions: 52 },
  { date: '2024-01-04', challenges: 10, solutions: 41 },
  { date: '2024-01-05', challenges: 18, solutions: 59 },
  { date: '2024-01-06', challenges: 13, solutions: 47 },
  { date: '2024-01-07', challenges: 16, solutions: 55 }
];

const categoryData = [
  { name: 'Technology', value: 30 },
  { name: 'Healthcare', value: 25 },
  { name: 'Sustainability', value: 20 },
  { name: 'Manufacturing', value: 15 },
  { name: 'Finance', value: 10 }
];

const recentActivity = [
  {
    type: 'challenge',
    action: 'New challenge "AI Quality Control" submitted',
    time: '5 minutes ago'
  },
  {
    type: 'solution',
    action: 'Solution approved for "Sustainable Packaging"',
    time: '15 minutes ago'
  },
  {
    type: 'user',
    action: 'New organization "TechCorp" registered',
    time: '1 hour ago'
  }
];

const challengesData = [
  {
    id: 1,
    title: 'AI-Powered Quality Control System',
    description: 'Develop an AI system to detect product defects...',
    organization: 'Manufacturing Corp',
    category: 'Manufacturing',
    status: 'Active',
    solutions: 31,
    posted: '2024-01-10'
  },
  {
    id: 2,
    title: 'Sustainable Packaging Solutions',
    description: 'Need innovative biodegradable packaging...',
    organization: 'GreenTech Industries',
    category: 'Sustainability',
    status: 'Pending',
    solutions: 0,
    posted: '2024-01-15'
  }
];

const solutionsData = [
  {
    id: 1,
    title: 'Machine Learning Defect Detection',
    summary: 'Advanced ML algorithm for real-time quality control...',
    challenge: 'AI Quality Control System',
    contributor: 'John Smith',
    status: 'Under Review',
    submitted: '2024-01-20'
  },
  {
    id: 2,
    title: 'Biodegradable Composite Materials',
    summary: 'Novel bio-based packaging material...',
    challenge: 'Sustainable Packaging',
    contributor: 'Sarah Johnson',
    status: 'Approved',
    submitted: '2024-01-18'
  }
];

export default AdminDashboard;
