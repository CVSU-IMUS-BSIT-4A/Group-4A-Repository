"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2, ChevronRight, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createEvent, createOrganization, getUserOrganizations, type Organization as OrganizationType } from "@/lib/api";
import { useRouter } from "next/navigation";
import { OrganizationStepIndicator } from "./organization-step-indicator";
import { PendingOrganizationWarning } from "./pending-organization-warning";
import { CreateOrganizationForm } from "./create-organization-form";
import { SelectOrganizationList } from "./select-organization-list";
import { OrganizationToggle } from "./organization-toggle";
import { EventDetailsForm } from "./event-details-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrganizationFormProps {
    onClose: () => void;
}

type Step = 1 | 2;

interface OrganizationFormData {
    organizationId?: number;
    name: string;
    description: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
}

interface EventFormData {
    image: string;
    title: string;
    description: string;
    maxAttendees: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    category: string;
}

const initialOrgFormData: OrganizationFormData = {
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
};

const initialEventFormData: EventFormData = {
    image: "",
    title: "",
    description: "",
    maxAttendees: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "",
};

export function OrganizationForm({ onClose }: OrganizationFormProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [orgFormData, setOrgFormData] = useState<OrganizationFormData>(initialOrgFormData);
    const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
    const [organizations, setOrganizations] = useState<OrganizationType[]>([]);
    const [showCreateOrg, setShowCreateOrg] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const logoFileInputRef = useRef<HTMLInputElement>(null);
    const [hasPendingOrganization, setHasPendingOrganization] = useState(false);
    const [pendingOrganization, setPendingOrganization] = useState<OrganizationType | null>(null);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Get user ID from localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const id = parseInt(user.id);
                if (!isNaN(id)) {
                    setUserId(id);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    // Fetch user's organizations
    useEffect(() => {
        const fetchOrganizations = async () => {
            if (!userId) return;
            
            setIsLoadingOrgs(true);
            try {
                const response = await getUserOrganizations(userId);
                const allOrgs = response.data;
                
                // Check for pending organizations
                const pending = allOrgs.find(org => org.status === "pending");
                if (pending) {
                    setHasPendingOrganization(true);
                    setPendingOrganization(pending);
                } else {
                    setHasPendingOrganization(false);
                    setPendingOrganization(null);
                }
                
                // Filter to only show approved organizations
                const approved = allOrgs.filter(org => org.status === "approved");
                setOrganizations(approved);
                
                // If user has no approved organizations and no pending, show create form only (no event step)
                if (approved.length === 0 && !pending) {
                    setShowCreateOrg(true);
                } else {
                    // If user has approved organizations (even with pending), show selection and allow event creation
                    setShowCreateOrg(false);
                    setCurrentStep(1); // Start with organization selection
                    // Pre-select first approved organization so user can create events immediately
                    if (approved.length > 0) {
                        setOrgFormData((prev) => ({ ...prev, organizationId: approved[0].id }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch organizations:", error);
                // On error, assume no organizations and show create form
                setOrganizations([]);
                setHasPendingOrganization(false);
                setPendingOrganization(null);
                setShowCreateOrg(true);
            } finally {
                setIsLoadingOrgs(false);
            }
        };

        if (userId) {
            void fetchOrganizations();
        }
    }, [userId]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoPreview(result);
                setOrgFormData((prev) => ({ ...prev, logo: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoPreview(null);
        setOrgFormData((prev) => ({ ...prev, logo: "" }));
        if (logoFileInputRef.current) {
            logoFileInputRef.current.value = "";
        }
    };

    const handleLogoUrlChange = (url: string) => {
        setOrgFormData((prev) => ({ ...prev, logo: url }));
        setLogoPreview(url);
    };

    const updateOrgField = (field: keyof OrganizationFormData, value: string | number | undefined) => {
        setOrgFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updateEventField = (field: keyof EventFormData, value: string) => {
        setEventFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateOrganizationStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (showCreateOrg) {
            if (!orgFormData.name.trim()) {
                newErrors.name = "Organization name is required";
            }
            if (!orgFormData.description.trim()) {
                newErrors.description = "Description is required";
            }
            if (orgFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgFormData.email)) {
                newErrors.email = "Invalid email format";
            }
            if (orgFormData.website && !/^https?:\/\/.+/.test(orgFormData.website)) {
                newErrors.website = "Invalid website URL (must start with http:// or https://)";
            }
        } else {
            if (!orgFormData.organizationId) {
                newErrors.organizationId = "Please select an organization";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateEventStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!eventFormData.title.trim()) {
            newErrors.title = "Event title is required";
        }
        if (!eventFormData.description.trim()) {
            newErrors.description = "Description is required";
        }
        if (!eventFormData.eventDate) {
            newErrors.eventDate = "Event date is required";
        }
        if (!eventFormData.startTime) {
            newErrors.startTime = "Start time is required";
        }
        if (!eventFormData.location.trim()) {
            newErrors.location = "Location is required";
        }
        if (!eventFormData.category) {
            newErrors.category = "Category is required";
        }
        if (eventFormData.maxAttendees && parseInt(eventFormData.maxAttendees) < 1) {
            newErrors.maxAttendees = "Maximum attendees must be at least 1";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateOrganization = async (): Promise<number | null> => {
        if (!userId) {
            throw new Error("User not found");
        }

        const organization = await createOrganization({
            name: orgFormData.name.trim(),
            description: orgFormData.description.trim() || undefined,
            website: orgFormData.website.trim() || undefined,
            email: orgFormData.email.trim() || undefined,
            phone: orgFormData.phone.trim() || undefined,
            address: orgFormData.address.trim() || undefined,
            logo: orgFormData.logo || undefined,
            userId: userId,
        });

        return organization.data.id;
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            if (!validateOrganizationStep()) {
                return;
            }

            try {
                setIsSubmitting(true);
                setSubmitError("");

                // If user has approved organizations and selected one, proceed to event step (even if pending org exists)
                if (!showCreateOrg && orgFormData.organizationId) {
                    setCurrentStep(2);
                    setSubmitError("");
                    return;
                }

                // Prevent creating NEW organization if there's a pending one
                if (showCreateOrg && hasPendingOrganization) {
                    setSubmitError("You already have a pending organization. Please wait for admin verification before creating another one. You can still create events with your approved organizations.");
                    return;
                }

                // If creating new organization (and user has no approved orgs)
                if (showCreateOrg && organizations.length === 0) {
                    const newOrgId = await handleCreateOrganization();
                    if (!newOrgId) {
                        throw new Error("Failed to create organization");
                    }
                    
                    // Show success message and close modal (no event creation step)
                    setSuccessMessage("Organization created successfully! It is pending admin verification. Once approved, you'll be able to create events as this organization.");
                    setSuccessDialogOpen(true);
                    return;
                }

                // User chose to create new org but already has approved orgs
                if (showCreateOrg && organizations.length > 0) {
                    // This case is already handled by the hasPendingOrganization check above
                    // But if they somehow get here without a pending org, proceed
                    const newOrgId = await handleCreateOrganization();
                    if (!newOrgId) {
                        throw new Error("Failed to create organization");
                    }
                    setOrgFormData((prev) => ({ ...prev, organizationId: newOrgId }));
                    setSuccessMessage("Organization created successfully! It is pending admin verification. For now, you can create events with your existing approved organizations.");
                    setSuccessDialogOpen(true);
                    // Use first approved org for event creation
                    if (organizations.length > 0) {
                        setOrgFormData((prev) => ({ ...prev, organizationId: organizations[0].id }));
                    }
                    setCurrentStep(2);
                    setSubmitError("");
                }
            } catch (error) {
                setSubmitError(
                    error instanceof Error ? error.message : "Failed to create organization. Please try again."
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        if (!validateEventStep()) {
            return;
        }

        if (!orgFormData.organizationId) {
            setSubmitError("Organization is required");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get user ID from localStorage
            const userData = localStorage.getItem("user");
            const userId = userData ? JSON.parse(userData).id : null;

            // Submit event with organization
            await createEvent({
                organizerId: userId ? parseInt(userId, 10) : undefined,
                organizationId: orgFormData.organizationId,
                title: eventFormData.title.trim(),
                description: eventFormData.description.trim(),
                eventDate: eventFormData.eventDate,
                startTime: eventFormData.startTime,
                endTime: eventFormData.endTime || undefined,
                location: eventFormData.location.trim(),
                category: eventFormData.category,
                image: eventFormData.image || undefined,
                maxAttendees: eventFormData.maxAttendees ? parseInt(eventFormData.maxAttendees) : undefined,
            });

            // Close dialog first
            onClose();
            
            // Navigate to my-events with organized tab and refresh trigger
            const refreshTimestamp = Date.now();
            await router.push(`/my-events?tab=organized&refresh=${refreshTimestamp}`);
            
            // Force a refresh to ensure data is fetched
            router.refresh();
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "Failed to create event. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedOrganization = organizations.find(org => org.id === orgFormData.organizationId);

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
            {/* Step Indicator - Only show if user has approved organizations */}
            {organizations.length > 0 && (
                <OrganizationStepIndicator currentStep={currentStep} />
            )}

            {/* Header for organization creation only (no approved orgs) */}
            {organizations.length === 0 && !isLoadingOrgs && (
                <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white text-center">
                        Create Organization
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
                        Create your organization to start organizing events
                    </p>
                </div>
            )}

            {/* Form Content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                <AnimatePresence mode="wait">
                    {/* If no approved organizations, only show creation form */}
                    {organizations.length === 0 && !isLoadingOrgs ? (
                        <motion.div
                            key="create-org-only"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="space-y-4 max-w-2xl mx-auto"
                        >
                            {/* Pending Organization Warning */}
                            {hasPendingOrganization && pendingOrganization && (
                                <PendingOrganizationWarning pendingOrganization={pendingOrganization} />
                            )}

                            {/* Create Organization Form */}
                            {!hasPendingOrganization && (
                                <CreateOrganizationForm
                                    orgFormData={orgFormData}
                                    errors={errors}
                                    logoPreview={logoPreview}
                                    onFieldChange={updateOrgField}
                                    onLogoUpload={handleLogoUpload}
                                    onLogoUrlChange={handleLogoUrlChange}
                                    onRemoveLogo={handleRemoveLogo}
                                    showPendingInfo={true}
                                    uploadId="logo-upload"
                                />
                            )}

                            {submitError && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                                >
                                    <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : currentStep === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="space-y-4 max-w-2xl mx-auto"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                    Select or Create Organization
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                    Choose an approved organization or create a new one (pending verification).
                                </p>
                            </div>

                            {/* Pending Organization Warning */}
                            {hasPendingOrganization && pendingOrganization && (
                                <PendingOrganizationWarning pendingOrganization={pendingOrganization} />
                            )}

                            {/* Organization Selection/Creation Toggle */}
                            {organizations.length > 0 && (
                                <OrganizationToggle
                                    showCreateOrg={showCreateOrg}
                                    hasPendingOrganization={hasPendingOrganization}
                                    onToggle={(showCreate) => {
                                        setShowCreateOrg(showCreate);
                                        if (!showCreate) {
                                            setOrgFormData((prev) => ({ ...prev, organizationId: organizations[0]?.id }));
                                        } else {
                                            setOrgFormData((prev) => ({ ...prev, organizationId: undefined }));
                                        }
                                    }}
                                />
                            )}

                            {isLoadingOrgs ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                                </div>
                            ) : showCreateOrg && !hasPendingOrganization ? (
                                <CreateOrganizationForm
                                    orgFormData={orgFormData}
                                    errors={errors}
                                    logoPreview={logoPreview}
                                    onFieldChange={updateOrgField}
                                    onLogoUpload={handleLogoUpload}
                                    onLogoUrlChange={handleLogoUrlChange}
                                    onRemoveLogo={handleRemoveLogo}
                                    showPendingInfo={true}
                                    uploadId="logo-upload-step1"
                                />
                            ) : !showCreateOrg ? (
                                <SelectOrganizationList
                                    organizations={organizations}
                                    selectedOrganizationId={orgFormData.organizationId}
                                    onSelect={(organizationId) => updateOrgField("organizationId", organizationId)}
                                />
                            ) : null}

                            {submitError && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                                >
                                    <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="space-y-4 max-w-2xl mx-auto"
                        >
                            <EventDetailsForm
                                eventFormData={eventFormData}
                                errors={errors}
                                onFieldChange={updateEventField}
                                selectedOrganizationName={selectedOrganization?.name}
                            />

                            {submitError && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                                >
                                    <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0 flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => {
                        if (organizations.length === 0) {
                            onClose();
                        } else if (currentStep === 1) {
                            onClose();
                        } else {
                            setCurrentStep(1);
                        }
                    }}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {organizations.length === 0 || currentStep === 1 ? "Cancel" : "Back"}
                </button>

                {/* If no approved organizations, show create button only */}
                {organizations.length === 0 ? (
                    <button
                        type="button"
                        onClick={async () => {
                            if (hasPendingOrganization) {
                                setSubmitError("You already have a pending organization. Please wait for admin verification before creating another one.");
                                return;
                            }
                            if (!validateOrganizationStep()) {
                                return;
                            }
                            setIsSubmitting(true);
                            setSubmitError("");
                            try {
                                await handleCreateOrganization();
                                setSuccessMessage("Organization created successfully! It is pending admin verification. Once approved, you'll be able to create events as this organization.");
                                setSuccessDialogOpen(true);
                            } catch (error) {
                                setSubmitError(
                                    error instanceof Error ? error.message : "Failed to create organization. Please try again."
                                );
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        disabled={isSubmitting || isLoadingOrgs || hasPendingOrganization}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                ) : currentStep === 1 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting || isLoadingOrgs}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating Event...
                            </>
                        ) : (
                            <>
                                Create Event
                                <Check className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Success Dialog */}
            <Dialog open={successDialogOpen} onOpenChange={(open) => {
                setSuccessDialogOpen(open);
                if (!open) {
                    onClose();
                    router.push('/my-events?refresh=true');
                }
            }}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-2 pb-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">Organization Created</DialogTitle>
                  </div>
                </DialogHeader>
                
                <div className="px-6 py-4">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {successMessage}
                  </p>
                </div>

                <div className="flex justify-end px-6 pb-6 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setSuccessDialogOpen(false);
                      onClose();
                      router.push('/my-events?refresh=true');
                    }}
                    className="min-w-[100px]"
                  >
                    OK
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
    );
}
