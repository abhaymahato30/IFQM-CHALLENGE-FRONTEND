import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Upload, 
  FileText, 
  Link as LinkIcon, 
  Users, 
  Shield,
  Lightbulb,
  Target,
  FileCode,
  Globe,
  Award,
  Plus,
  X,
  Sparkles
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// Define the interface for form data
interface SolutionData {
  title: string;
  executive_summary: string;
  primary_approach: string;
  detailed_description: string;
  methodology_and_implementation: string;
  expected_impact: string;
  resources_required: string;
  what_makes_this_different: string;
  supporting_documents: string[];
  external_resources: { label: string; url: string }[];
  additional_notes: string;
  ip_ownership_declaration: string;
  collaboration_willingness: boolean;
  team_members: string[];
  visibility: "public" | "private";
}

const SolutionSubmission = () => {
  const navigate = useNavigate();
  const { challengeId } = useParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SolutionData>({
    title: "",
    executive_summary: "",
    primary_approach: "",
    detailed_description: "",
    methodology_and_implementation: "",
    expected_impact: "",
    resources_required: "",
    what_makes_this_different: "",
    supporting_documents: [],
    external_resources: [{ label: "", url: "" }],
    additional_notes: "",
    ip_ownership_declaration: "",
    collaboration_willingness: false,
    team_members: [""],
    visibility: "public",
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof SolutionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const validateCurrentStep = () => {
    // basic validation per step
    switch (currentStep) {
      case 1:
        if (!formData.title || !formData.executive_summary || !formData.primary_approach) {
          toast.error("Please fill required fields.");
          return false;
        }
        break;
      case 2:
        if (!formData.detailed_description || !formData.methodology_and_implementation || !formData.expected_impact) {
          toast.error("Please fill required fields.");
          return false;
        }
        break;
      case 4:
        if (!formData.ip_ownership_declaration) {
          toast.error("Please declare IP ownership.");
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic string validation helper
    const isEmpty = (str) => !str || !str.trim();

    // URL validation helper
    const isValidURL = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    // Required fields check
    if (isEmpty(formData.title)) {
      toast.error("Title is required");
      return;
    }
    if (isEmpty(formData.executive_summary)) {
      toast.error("Executive summary is required");
      return;
    }
    if (isEmpty(formData.primary_approach)) {
      toast.error("Primary approach is required");
      return;
    }
    
    // Additional validation for primary_approach
    if (!formData.primary_approach || formData.primary_approach === "") {
      toast.error("Please select a primary approach");
      return;
    }
    if (isEmpty(formData.detailed_description)) {
      toast.error("Detailed description is required");
      return;
    }
    if (isEmpty(formData.methodology_and_implementation)) {
      toast.error("Methodology and implementation is required");
      return;
    }
    if (isEmpty(formData.expected_impact)) {
      toast.error("Expected impact is required");
      return;
    }
    if (isEmpty(formData.resources_required)) {
      toast.error("Resources required field is required");
      return;
    }
    if (isEmpty(formData.what_makes_this_different)) {
      toast.error("What makes this different? field is required");
      return;
    }
    
    if (isEmpty(formData.ip_ownership_declaration)) {
      toast.error("IP ownership declaration is required");
      return;
    }

    // Supporting documents URLs validation
    const validSupportingDocs = formData.supporting_documents.filter(doc => doc.trim() !== "");
    if (validSupportingDocs.some(doc => !isValidURL(doc))) {
      toast.error("All supporting documents must be valid URLs");
      return;
    }

    // External resources validation
    const validExternalResources = formData.external_resources.filter(res => res.label.trim() !== "" && res.url.trim() !== "");
    for (const resource of validExternalResources) {
      if (isEmpty(resource.label) || !isValidURL(resource.url)) {
        toast.error("Each external resource must have a label and a valid URL");
        return;
      }
    }

    // Team members validation
    const validTeamMembers = formData.team_members.filter(m => m.trim() !== "");
    if (validTeamMembers.length === 0) {
      toast.error("At least one team member is required");
      return;
    }

    // Prepare the payload according to the API specification
    const payload = {
      challenge_id: "64d3a6e2c4f1b2a9f1234567", // Use the valid ObjectId format
      user_id: "64d3b8f7c4f1b2a9f1234569", // This should come from user context/auth
      title: formData.title.trim(),
      executive_summary: formData.executive_summary.trim(),
      primary_approach: formData.primary_approach.trim(),
      detailed_description: formData.detailed_description.trim(),
      methodology_and_implementation: formData.methodology_and_implementation.trim(),
      expected_impact: formData.expected_impact.trim(),
      resources_required: formData.resources_required.trim(),
      what_makes_this_different: formData.what_makes_this_different.trim(),
      supporting_documents: validSupportingDocs,
      external_resources: validExternalResources,
      additional_notes: (formData.additional_notes || "").trim(),
      ip_ownership_declaration: formData.ip_ownership_declaration.trim(),
      collaboration_willingness: Boolean(formData.collaboration_willingness),
      team_members: validTeamMembers,
      visibility: formData.visibility,
      rating: 0
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    // Submit to backend
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/solutions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        console.log("Response status:", res.status);
        console.log("Response headers:", res.headers);
        
        if (!res.ok) {
          // Try to get error details from response
          let errorMessage = `Server returned ${res.status}: ${res.statusText}`;
          try {
            const errorText = await res.text();
            console.log("Error response text:", errorText);
            
            // Try to parse as JSON
            try {
              const errorData = JSON.parse(errorText);
              console.log("Parsed error data:", errorData);
              if (errorData.message) {
                errorMessage += ` - ${errorData.message}`;
              }
              if (errorData.errors) {
                errorMessage += ` - ${JSON.stringify(errorData.errors)}`;
              }
            } catch (parseError) {
              // If it's not JSON, use the raw text
              errorMessage += ` - ${errorText}`;
            }
          } catch (e) {
            console.log("Could not read error response:", e);
          }
          console.error("Server error details:", errorMessage);
          throw new Error(errorMessage);
        }
        return res.json();
      })
      .then(data => {
        console.log("Submission successful:", data);
        toast.success("Solution submitted successfully!");
        navigate("/challenges"); // Redirect to challenges page after successful submission
      })
      .catch(err => {
        console.error("Error submitting:", err);
        toast.error(`Submission failed: ${err.message}`);
      });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 formData={formData} updateFormData={updateFormData} />;
      case 2: return <Step2 formData={formData} updateFormData={updateFormData} />;
      case 3: return <Step3 formData={formData} updateFormData={updateFormData} />;
      case 4: return <Step4 formData={formData} updateFormData={updateFormData} />;
      default: return null;
    }
  };

  const getStepInfo = (step: number) => {
    const steps = [
      { title: "Solution Overview", description: "Basic information about your solution", icon: Lightbulb },
      { title: "Implementation Details", description: "How you'll bring your solution to life", icon: Target },
      { title: "Supporting Materials", description: "Documents and resources", icon: FileCode },
      { title: "Legal & Team", description: "IP rights and collaboration details", icon: Shield }
    ];
    return steps[step - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-4 shadow-sm border border-white/20">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Submit Your Innovation</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
            Solution Submission
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your innovative solution with the world. Let's make a difference together.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                  {currentStep}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {getStepInfo(currentStep).title}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          
          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" 
                 style={{ width: `${progress}%` }} />
          </div>
          
          <p className="text-sm text-gray-600 mt-2 text-center">
            {getStepInfo(currentStep).description}
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1} 
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" /> 
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button 
              onClick={nextStep} 
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Check className="h-4 w-4" /> 
              Submit Solution
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 1: Solution Overview
const Step1 = ({ formData, updateFormData }: any) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lightbulb className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Solution Overview</h2>
      <p className="text-gray-600">Tell us about your innovative solution</p>
    </div>

    <div className="grid gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Solution Title *
        </Label>
        <Input 
          value={formData.title} 
          onChange={e => updateFormData("title", e.target.value)}
          placeholder="Enter a compelling title for your solution"
          className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Executive Summary *</Label>
        <Textarea 
          value={formData.executive_summary} 
          onChange={e => updateFormData("executive_summary", e.target.value)} 
          rows={4}
          placeholder="Provide a concise overview of your solution and its key benefits"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Primary Approach *</Label>
        <Select value={formData.primary_approach} onValueChange={val => updateFormData("primary_approach", val)}>
          <SelectTrigger className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
            <SelectValue placeholder="Select the primary approach for your solution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Renewable Energy Technology">Renewable Energy Technology</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="process">Process</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

// Step 2: Implementation Details
const Step2 = ({ formData, updateFormData }: any) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Implementation Details</h2>
      <p className="text-gray-600">How will you bring your solution to life?</p>
    </div>

    <div className="grid gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Detailed Description *</Label>
        <Textarea 
          value={formData.detailed_description} 
          onChange={e => updateFormData("detailed_description", e.target.value)} 
          rows={4}
          placeholder="Provide a comprehensive description of your solution"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Methodology & Implementation *</Label>
        <Textarea 
          value={formData.methodology_and_implementation} 
          onChange={e => updateFormData("methodology_and_implementation", e.target.value)} 
          rows={4}
          placeholder="Explain your approach and implementation strategy"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Expected Impact *</Label>
        <Textarea 
          value={formData.expected_impact} 
          onChange={e => updateFormData("expected_impact", e.target.value)} 
          rows={3}
          placeholder="Describe the potential impact and outcomes of your solution"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Resources Required</Label>
        <Textarea 
          value={formData.resources_required} 
          onChange={e => updateFormData("resources_required", e.target.value)} 
          rows={3}
          placeholder="List the resources, funding, and support needed"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">What Makes This Different</Label>
        <Textarea 
          value={formData.what_makes_this_different} 
          onChange={e => updateFormData("what_makes_this_different", e.target.value)} 
          rows={3}
          placeholder="Explain what sets your solution apart from existing approaches"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  </div>
);

// Step 3: Supporting Materials
const Step3 = ({ formData, updateFormData }: any) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileCode className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Supporting Materials</h2>
      <p className="text-gray-600">Add documents and resources to strengthen your submission</p>
    </div>

    <div className="grid gap-8">
      {/* Supporting Documents */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="h-4 w-4 text-purple-600" />
          Supporting Documents
        </Label>
        <div className="space-y-3">
          {formData.supporting_documents.map((doc: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                placeholder="Document URL (e.g., https://example.com/document.pdf)"
                value={doc}
                onChange={e => {
                  const arr = [...formData.supporting_documents];
                  arr[idx] = e.target.value;
                  updateFormData("supporting_documents", arr);
                }}
                className="flex-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
              {formData.supporting_documents.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const arr = formData.supporting_documents.filter((_, i) => i !== idx);
                    updateFormData("supporting_documents", arr);
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => updateFormData("supporting_documents", [...formData.supporting_documents, ""])}
            className="border-dashed border-gray-300 text-gray-600 hover:border-purple-500 hover:text-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* External Resources */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          External Resources
        </Label>
        <div className="space-y-4">
          {formData.external_resources.map((res: any, idx: number) => (
            <div key={idx} className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
              <Input 
                placeholder="Resource label" 
                value={res.label} 
                onChange={e => {
                  const arr = [...formData.external_resources];
                  arr[idx].label = e.target.value;
                  updateFormData("external_resources", arr);
                }}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Input 
                  placeholder="Resource URL" 
                  value={res.url} 
                  onChange={e => {
                    const arr = [...formData.external_resources];
                    arr[idx].url = e.target.value;
                    updateFormData("external_resources", arr);
                  }}
                  className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formData.external_resources.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const arr = formData.external_resources.filter((_, i) => i !== idx);
                      updateFormData("external_resources", arr);
                    }}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => updateFormData("external_resources", [...formData.external_resources, { label: "", url: "" }])}
            className="border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Additional Notes</Label>
        <Textarea 
          value={formData.additional_notes} 
          onChange={e => updateFormData("additional_notes", e.target.value)} 
          rows={3}
          placeholder="Any additional information you'd like to share"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  </div>
);

// Step 4: Legal & Team
const Step4 = ({ formData, updateFormData }: any) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal & Team</h2>
      <p className="text-gray-600">Final details about IP rights and your team</p>
    </div>

    <div className="grid gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">IP Ownership Declaration *</Label>
        <Select value={formData.ip_ownership_declaration} onValueChange={val => updateFormData("ip_ownership_declaration", val)}>
          <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
            <SelectValue placeholder="Select your IP ownership approach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IP rights shared between the research team and investors.">IP rights shared between the research team and investors.</SelectItem>
            <SelectItem value="retain">Retain All IP</SelectItem>
            <SelectItem value="shared">Share with Challenge Owner</SelectItem>
            <SelectItem value="transfer">Transfer Upon Agreement</SelectItem>
            <SelectItem value="open">Open Source / Public Domain</SelectItem>
            <SelectItem value="negotiate">Open to Negotiation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">Collaboration Willingness</Label>
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
          <Checkbox 
            checked={formData.collaboration_willingness} 
            onCheckedChange={val => updateFormData("collaboration_willingness", val)}
            className="border-gray-300 focus:ring-orange-500"
          />
          <Label className="text-sm text-gray-700">I am willing to collaborate with other teams and organizations</Label>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Users className="h-4 w-4 text-green-600" />
          Team Members
        </Label>
        <div className="space-y-3">
          {formData.team_members.map((member: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input 
                placeholder="Team member name and role" 
                value={member} 
                onChange={e => {
                  const arr = [...formData.team_members];
                  arr[idx] = e.target.value;
                  updateFormData("team_members", arr);
                }}
                className="flex-1 border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              {formData.team_members.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const arr = formData.team_members.filter((_, i) => i !== idx);
                    updateFormData("team_members", arr);
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => updateFormData("team_members", [...formData.team_members, ""])}
            className="border-dashed border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Visibility</Label>
        <Select value={formData.visibility} onValueChange={val => updateFormData("visibility", val)}>
          <SelectTrigger className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public - Visible to everyone</SelectItem>
            <SelectItem value="private">Private - Only visible to challenge organizers</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

export default SolutionSubmission;
