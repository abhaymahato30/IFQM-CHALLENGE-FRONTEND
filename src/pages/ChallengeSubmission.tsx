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
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ChallengeData {
  title: string;
  briefDescription: string;
  category: string;
  detailedDescription: string;
  currentState: string;
  desiredOutcomes: string;
  constraints: string;
  successMetrics: string;
  urgency: string;
  region: string;
  timeline: string;
  rewardType: string;
  rewardAmount: string;
  ipConsiderations: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
  agreementChecked: boolean;
}

const ChallengeSubmission = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ChallengeData>({
    title: "",
    briefDescription: "",
    category: "",
    detailedDescription: "",
    currentState: "",
    desiredOutcomes: "",
    constraints: "",
    successMetrics: "",
    urgency: "",
    region: "",
    timeline: "",
    rewardType: "",
    rewardAmount: "",
    ipConsiderations: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    organization: "",
    agreementChecked: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof ChallengeData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title || !formData.briefDescription || !formData.category) {
          toast.error("Please fill in all required fields");
          return false;
        }
        break;
      case 2:
        if (!formData.detailedDescription || !formData.currentState || !formData.desiredOutcomes) {
          toast.error("Please fill in all required fields");
          return false;
        }
        break;
      case 3:
        if (!formData.urgency || !formData.timeline || !formData.rewardType) {
          toast.error("Please fill in all required fields");
          return false;
        }
        break;
      case 4:
        if (!formData.contactName || !formData.contactEmail || !formData.organization || !formData.agreementChecked) {
          toast.error("Please fill in all required fields and accept the agreement");
          return false;
        }
        break;
    }
    return true;
  };

  // Convert timeline string to ISO date string or null if flexible
  const getTimelineDate = (timeline: string): string | null => {
    const now = new Date();

    switch (timeline) {
      case "1-month":
        now.setMonth(now.getMonth() + 1);
        break;
      case "3-months":
        now.setMonth(now.getMonth() + 3);
        break;
      case "6-months":
        now.setMonth(now.getMonth() + 6);
        break;
      case "1-year":
        now.setFullYear(now.getFullYear() + 1);
        break;
      case "flexible":
        return null;
      default:
        return null;
    }
    return now.toISOString();
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      const timelineDate = getTimelineDate(formData.timeline);

      const payload = {
        title: formData.title,
        brief_description: formData.briefDescription,
        category: formData.category,
        detailed_description: formData.detailedDescription,
        current_state: formData.currentState,
        desired_outcomes: formData.desiredOutcomes,
        constraints_requirements: formData.constraints,
        success_metrics: formData.successMetrics,
        urgency_level: formData.urgency,
        region_affected: formData.region,
        desired_timeline: timelineDate, // ISO date or null
        reward_type: formData.rewardType,
        reward_details: formData.rewardAmount,
        ip_considerations: formData.ipConsiderations,
        contact_info: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          organization: formData.organization,
        },
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/challenges`, payload);

      toast.success("Challenge submitted successfully!");
      navigate("/challenges");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit challenge. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2 formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3 formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4 formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Submit a Challenge</h1>
            <p className="text-xl text-muted-foreground">
              Share your operational challenge with our community of innovators
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mb-8">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center text-center max-w-24">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    currentStep > index + 1
                      ? "bg-primary text-primary-foreground"
                      : currentStep === index + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs text-muted-foreground">{title}</span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <Card className="mb-8">{renderStep()}</Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center bg-secondary hover:bg-secondary/90"
              >
                <Check className="h-4 w-4 mr-2" />
                Submit Challenge
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const stepTitles = ["Overview", "Details", "Logistics", "Review"];

const Step1 = ({
  formData,
  updateFormData,
}: {
  formData: ChallengeData;
  updateFormData: Function;
}) => (
  <div>
    <CardHeader>
      <CardTitle>Challenge Overview</CardTitle>
      <CardDescription>Provide a clear overview of your challenge</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <Label htmlFor="title" className="flex items-center">
          Challenge Title <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter a clear, descriptive title for your challenge"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="briefDescription" className="flex items-center">
          Brief Description <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="briefDescription"
          placeholder="Provide a concise summary of the challenge (2-3 sentences)"
          value={formData.briefDescription}
          onChange={(e) => updateFormData("briefDescription", e.target.value)}
          rows={3}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="category" className="flex items-center">
          Category <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          onValueChange={(value) => updateFormData("category", value)}
          value={formData.category}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select the primary category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="sustainability">Sustainability</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </div>
);

const Step2 = ({
  formData,
  updateFormData,
}: {
  formData: ChallengeData;
  updateFormData: Function;
}) => (
  <div>
    <CardHeader>
      <CardTitle>Problem Details</CardTitle>
      <CardDescription>Provide comprehensive details about the challenge</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <Label htmlFor="detailedDescription" className="flex items-center">
          Detailed Description <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="detailedDescription"
          placeholder="Provide a comprehensive description of the challenge, including context and background"
          value={formData.detailedDescription}
          onChange={(e) => updateFormData("detailedDescription", e.target.value)}
          rows={5}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="currentState" className="flex items-center">
          Current State <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="currentState"
          placeholder="Describe the current situation and what you've already tried"
          value={formData.currentState}
          onChange={(e) => updateFormData("currentState", e.target.value)}
          rows={3}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="desiredOutcomes" className="flex items-center">
          Desired Outcomes <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="desiredOutcomes"
          placeholder="What does success look like? What are your specific goals?"
          value={formData.desiredOutcomes}
          onChange={(e) => updateFormData("desiredOutcomes", e.target.value)}
          rows={3}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="constraints">Constraints & Requirements</Label>
        <Textarea
          id="constraints"
          placeholder="Any technical, budget, regulatory, or other constraints we should know about"
          value={formData.constraints}
          onChange={(e) => updateFormData("constraints", e.target.value)}
          rows={3}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="successMetrics">Success Metrics</Label>
        <Textarea
          id="successMetrics"
          placeholder="How will you measure the success of proposed solutions?"
          value={formData.successMetrics}
          onChange={(e) => updateFormData("successMetrics", e.target.value)}
          rows={2}
          className="mt-2"
        />
      </div>
    </CardContent>
  </div>
);

const Step3 = ({
  formData,
  updateFormData,
}: {
  formData: ChallengeData;
  updateFormData: Function;
}) => (
  <div>
    <CardHeader>
      <CardTitle>Logistics & Rewards</CardTitle>
      <CardDescription>Provide info about urgency, timeline, rewards, and IP</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <Label htmlFor="urgency" className="flex items-center">
          Urgency Level <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          value={formData.urgency}
          onValueChange={(value) => updateFormData("urgency", value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select urgency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="timeline" className="flex items-center">
          Desired Timeline <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          value={formData.timeline}
          onValueChange={(value) => updateFormData("timeline", value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-month">Within 1 month</SelectItem>
            <SelectItem value="3-months">Within 3 months</SelectItem>
            <SelectItem value="6-months">Within 6 months</SelectItem>
            <SelectItem value="1-year">Within 1 year</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="region">Region Affected</Label>
        <Input
          id="region"
          placeholder="Specify geographic region (optional)"
          value={formData.region}
          onChange={(e) => updateFormData("region", e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="rewardType" className="flex items-center">
          Reward Type <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          value={formData.rewardType}
          onValueChange={(value) => updateFormData("rewardType", value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select reward type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monetary">Monetary</SelectItem>
            <SelectItem value="recognition">Recognition</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="rewardAmount">Reward Details</Label>
        <Input
          id="rewardAmount"
          placeholder="Specify reward amount or details"
          value={formData.rewardAmount}
          onChange={(e) => updateFormData("rewardAmount", e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="ipConsiderations">Intellectual Property Considerations</Label>
        <Textarea
          id="ipConsiderations"
          placeholder="Any IP constraints or considerations"
          value={formData.ipConsiderations}
          onChange={(e) => updateFormData("ipConsiderations", e.target.value)}
          rows={2}
          className="mt-2"
        />
      </div>
    </CardContent>
  </div>
);

const Step4 = ({
  formData,
  updateFormData,
}: {
  formData: ChallengeData;
  updateFormData: Function;
}) => (
  <div>
    <CardHeader>
      <CardTitle>Contact Information & Agreement</CardTitle>
      <CardDescription>Provide contact details and accept terms</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <Label htmlFor="contactName" className="flex items-center">
          Contact Name <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="contactName"
          placeholder="Your full name"
          value={formData.contactName}
          onChange={(e) => updateFormData("contactName", e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="contactEmail" className="flex items-center">
          Contact Email <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="contactEmail"
          placeholder="Your email address"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => updateFormData("contactEmail", e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="contactPhone">Contact Phone Number</Label>
        <Input
          id="contactPhone"
          placeholder="Phone number (optional)"
          value={formData.contactPhone}
          onChange={(e) => updateFormData("contactPhone", e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="organization" className="flex items-center">
          Organization <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="organization"
          placeholder="Your organization or company"
          value={formData.organization}
          onChange={(e) => updateFormData("organization", e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <Checkbox
          id="agreementChecked"
          checked={formData.agreementChecked}
          onCheckedChange={(checked) => updateFormData("agreementChecked", checked === true)}
        />
        <Label htmlFor="agreementChecked" className="text-sm">
          I agree to the terms and conditions
        </Label>
      </div>
    </CardContent>
  </div>
);

export default ChallengeSubmission;
