import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import {
  Search,
  Filter,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Users,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

const ChallengeBrowse = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [selectedReward, setSelectedReward] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch challenges from backend with pagination and filters
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError("");
      try {
        // Build query params for pagination and filters
        const params: any = {
          page,
          limit: ITEMS_PER_PAGE,
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedUrgency) params.urgency_level = selectedUrgency;
        if (selectedReward) params.reward_type = selectedReward;

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/challenges`,
          { params }
        );

        // Assuming backend sends array directly or inside data property
        setChallenges(response.data.data || response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [page, searchTerm, selectedCategory, selectedUrgency, selectedReward]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedUrgency("");
    setSelectedReward("");
  };

  // Pagination controls
  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Browse Challenges
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover real-world problems waiting for innovative solutions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search challenges by title, description, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Link to="/challenge/submit">
              <Button className="md:w-auto w-full">
                <Target className="h-4 w-4 mr-2" />
                Post Challenge
              </Button>
            </Link>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="p-4 animate-fade-in border rounded-md mb-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Energy">Energy</SelectItem>
                      {/* Add other categories as needed */}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Urgency</label>
                  <Select
                    onValueChange={setSelectedUrgency}
                    value={selectedUrgency}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Urgency</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Reward Type</label>
                  <Select
                    onValueChange={setSelectedReward}
                    value={selectedReward}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Rewards" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Rewards</SelectItem>
                      <SelectItem value="Cash Prize">Cash Prize</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Recognition">Recognition</SelectItem>
                      <SelectItem value="Combined">Combined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading and Error */}
        {loading && <p className="text-center">Loading challenges...</p>}
        {error && (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        )}

        {/* Challenge Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            challenges.map((challenge) => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
        </div>

        {/* Empty State */}
        {!loading && challenges.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No challenges found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters to find more challenges.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={prevPage} disabled={page === 1}>
            Previous
          </Button>
          <span className="flex items-center">Page {page}</span>
          <Button onClick={nextPage} disabled={challenges.length < ITEMS_PER_PAGE}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const ChallengeCard = ({ challenge }: { challenge: any }) => {
  const urgencyColors = {
    Critical: "destructive",
    High: "default",
    Medium: "secondary",
    Low: "outline",
  };

  const urgency = challenge.urgency_level || "Low";

  return (
    <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
      <CardHeader>
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant={urgencyColors[urgency as keyof typeof urgencyColors] as any}
          >
            {urgency}
          </Badge>
          <Badge variant="outline">{challenge.category}</Badge>
        </div>

        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
          {challenge.title}
        </CardTitle>

        <CardDescription className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-1" />
          {challenge.region_affected}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm mb-4 line-clamp-3 text-muted-foreground">
          {challenge.brief_description || challenge.detailed_description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Timeline: {challenge.desired_timeline?.split("T")[0]}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            Region: {challenge.region_affected}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-1" />
            {challenge.solutions_count ?? 0} solutions
          </div>
          <div className="flex items-center text-sm text-secondary font-medium">
            <Award className="h-4 w-4 mr-1" />
            {challenge.reward_details || challenge.reward_type}
          </div>
        </div>

        <Link to={`/challenge/${challenge._id}`} className="block mt-4">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ChallengeBrowse;
