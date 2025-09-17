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
import { Link, useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

interface Challenge {
  _id: string;
  title: string;
  category: string;
  urgency_level?: string;
  brief_description?: string;
  detailed_description?: string;
  region_affected?: string;
  desired_timeline?: string;
  solutions_count?: number;
  reward_type?: string;
  reward_details?: string;
}

const ChallengeBrowse = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [selectedReward, setSelectedReward] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedUrgency, selectedReward]);

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError("");
      try {
        const params: Record<string, any> = { page, limit: ITEMS_PER_PAGE };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedUrgency) params.urgency_level = selectedUrgency;
        if (selectedReward) params.reward_type = selectedReward;

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/challenges`,
          {
            params,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setChallenges(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [page, searchTerm, selectedCategory, selectedUrgency, selectedReward, token]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedUrgency("");
    setSelectedReward("");
  };

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse Challenges</h1>
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
            {/* <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button> */}
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
                <FilterSelect
                  label="Category"
                  options={["", "Environment", "Transportation", "Energy"]}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="All Categories"
                />
                <FilterSelect
                  label="Urgency"
                  options={["", "Critical", "High", "Medium", "Low"]}
                  value={selectedUrgency}
                  onChange={setSelectedUrgency}
                  placeholder="All Urgency"
                />
                <FilterSelect
                  label="Reward Type"
                  options={["", "Cash Prize", "Equity", "Recognition", "Combined"]}
                  value={selectedReward}
                  onChange={setSelectedReward}
                  placeholder="All Rewards"
                />
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading, Error, Empty */}
        {loading && <p className="text-center">Loading challenges...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}
        {!loading && challenges.length === 0 && (
          <EmptyState onClear={clearFilters} />
        )}

        {/* Challenge Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && challenges.map((c) => <ChallengeCard key={c._id} challenge={c} />)}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={prevPage} disabled={page === 1}>
            Previous
          </Button>
          <span className="flex items-center">
            Page {page} / {totalPages}
          </span>
          <Button onClick={nextPage} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reusable filter select component
const FilterSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) => (
  <div>
    <label className="text-sm font-medium mb-2 block">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt || placeholder}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

// Empty state component
const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-2xl font-semibold mb-2">No challenges found</h3>
    <p className="text-muted-foreground mb-6">
      Try adjusting your search terms or filters to find more challenges.
    </p>
    <Button variant="outline" onClick={onClear}>
      Clear All Filters
    </Button>
  </div>
);

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const urgencyColors = {
    Critical: "destructive",
    High: "default",
    Medium: "secondary",
    Low: "outline",
  };
  const urgency = challenge.urgency_level || "Low";
  const navigate = useNavigate();

  const handleViewDetails = () => {
    localStorage.setItem("challengeId", challenge._id);
    navigate(`/challenge/${challenge._id}`);
  };

  return (
    <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
      <CardHeader>
        <div className="flex justify-between items-start mb-3">
          <Badge variant={urgencyColors[urgency as keyof typeof urgencyColors] as any}>
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

        <div className="space-y-2 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Timeline: {challenge.desired_timeline?.split("T")[0]}
          </div>
          <div className="flex items-center">
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

        <Button onClick={handleViewDetails} className="mt-3">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChallengeBrowse;
