"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2, Calendar, Clock, MapPin, Users, FileText, Type, ArrowLeft, Upload, X, Image as ImageIcon, ChevronRight, Check, Tag, CalendarDays } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { createEvent } from "@/lib/api";
import { useRouter } from "next/navigation";

interface IndividualFormProps {
    onClose: () => void;
}

type Step = 1 | 2;

interface FormData {
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

const CATEGORIES = [
    "Personal",
    "Workshop",
    "Meetup",
    "Community",
    "Social",
    "Sports",
    "Music",
    "Art",
    "Food",
    "Other",
];

const initialFormData: FormData = {
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

export function IndividualForm({ onClose }: IndividualFormProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setBannerPreview(result);
                setFormData((prev) => ({ ...prev, image: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBanner = () => {
        setBannerPreview(null);
        setFormData((prev) => ({ ...prev, image: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageUrlChange = (url: string) => {
        setFormData((prev) => ({ ...prev, image: url }));
        setBannerPreview(url);
    };

    const updateField = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Memoized validation errors
    const step1Errors = useMemo((): Partial<FormData> => {
        const stepErrors: Partial<FormData> = {};

        if (!formData.title.trim()) {
            stepErrors.title = "Event name is required";
        } else if (formData.title.length < 3) {
            stepErrors.title = "Event name must be at least 3 characters";
        }

        if (!formData.description.trim()) {
            stepErrors.description = "Description is required";
        } else if (formData.description.length < 10) {
            stepErrors.description = "Description must be at least 10 characters";
        }

        return stepErrors;
    }, [formData.title, formData.description]);

    const step2Errors = useMemo((): Partial<FormData> => {
        const stepErrors: Partial<FormData> = {};

        if (!formData.eventDate) {
            stepErrors.eventDate = "Event date is required";
        } else {
            const selectedDate = new Date(formData.eventDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                stepErrors.eventDate = "Event date cannot be in the past";
            }
        }

        if (!formData.startTime) {
            stepErrors.startTime = "Start time is required";
        }

        if (!formData.location.trim()) {
            stepErrors.location = "Location is required";
        }

        if (!formData.category) {
            stepErrors.category = "Category is required";
        }

        return stepErrors;
    }, [formData.eventDate, formData.startTime, formData.location, formData.category]);

    const isStep1Valid = useMemo(() => Object.keys(step1Errors).length === 0, [step1Errors]);
    const isStep2Valid = useMemo(() => Object.keys(step2Errors).length === 0, [step2Errors]);

    // Only show errors that were explicitly set (after validation attempts)
    const displayErrors = useMemo(() => {
        return errors;
    }, [errors]);

    const validateStep1 = (): boolean => {
        setErrors(step1Errors);
        return isStep1Valid;
    };

    const validateStep2 = (): boolean => {
        setErrors(step2Errors);
        return isStep2Valid;
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            // Get user ID from localStorage
            const userData = localStorage.getItem("user");
            if (!userData) {
                throw new Error("You must be logged in to create an event");
            }

            const user = JSON.parse(userData);
            const organizerId = parseInt(user.id);

            if (!organizerId || isNaN(organizerId)) {
                throw new Error("Invalid user ID");
            }

            // Submit to backend
            await createEvent({
                organizerId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                eventDate: formData.eventDate,
                startTime: formData.startTime,
                endTime: formData.endTime || undefined,
                location: formData.location.trim(),
                category: formData.category,
                image: formData.image || undefined,
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
            });

            // Close dialog first
            onClose();
            
            // Navigate to my-events with organized tab and refresh trigger
            // Use router.push with a timestamp to ensure refresh
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

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
            {/* Step Indicator */}
            <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                <div className="flex items-center justify-center max-w-md mx-auto">
                    {[1, 2].map((step, index) => (
                        <div key={step} className="flex items-center">
                            <div className="flex flex-col items-center relative z-10">
                                <motion.div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                                        currentStep === step
                                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md ring-2 ring-neutral-900/10 dark:ring-white/10"
                                            : currentStep > step
                                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm"
                                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-2 border-neutral-200 dark:border-neutral-700"
                                    )}
                                    transition={{ type: "tween", duration: 0.1 }}
                                >
                                    {currentStep > step ? (
                                        <Check className="w-5 h-5" />
                                    ) : step === 1 ? (
                                        <FileText className="w-5 h-5" />
                                    ) : (
                                        <CalendarDays className="w-5 h-5" />
                                    )}
                                </motion.div>
                                <p
                                    className={cn(
                                        "mt-2 text-xs font-medium transition-colors",
                                        currentStep === step
                                            ? "text-neutral-900 dark:text-white font-semibold"
                                            : currentStep > step
                                            ? "text-neutral-700 dark:text-neutral-300"
                                            : "text-neutral-400 dark:text-neutral-500"
                                    )}
                                >
                                    {step === 1 && "Details"}
                                    {step === 2 && "Time & Venue"}
                                </p>
                            </div>
                            {index < 1 && (
                                <div className="w-16 sm:w-24 mx-4 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-neutral-900 dark:bg-white rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: currentStep > step ? "100%" : "0%" }}
                                        transition={{ duration: 0.15, ease: "easeInOut" }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                <AnimatePresence mode="wait">
                    {/* Step 1: Banner, Name, Description, Attendees */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="space-y-4"
                        >
                            {/* Banner Upload */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Image Banner <span className="text-neutral-400">(optional)</span>
                                </label>

                                {bannerPreview ? (
                                    <div className="relative group">
                                        <motion.div
                                            className="relative w-full h-28 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <Image
                                                src={bannerPreview}
                                                alt="Event banner preview"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveBanner}
                                                className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full transition-all shadow-lg opacity-0 group-hover:opacity-100 z-10 hover:scale-110"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerUpload}
                                            className="hidden"
                                            id="banner-upload"
                                        />
                                        <label
                                            htmlFor="banner-upload"
                                            className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 hover:from-neutral-100 hover:to-neutral-150 dark:hover:from-neutral-700 dark:hover:to-neutral-800 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                                                    <Upload className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                        Click to upload
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                        PNG, JPG up to 10MB
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                {/* Image URL Input */}
                                <div className="mt-2">
                                    <div className="relative">
                                        <ImageIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => handleImageUrlChange(e.target.value)}
                                            placeholder="Or enter image URL"
                                            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Event Name */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Event Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Type className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => updateField("title", e.target.value)}
                                        placeholder="Enter event name"
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all text-xs font-medium shadow-sm hover:shadow-md",
                                            displayErrors.title
                                                ? "border-red-400 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                                                : "border-neutral-200 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white"
                                        )}
                                    />
                                </div>
                                {displayErrors.title && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                        className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                                    >
                                        <span>•</span>
                                        {displayErrors.title}
                                    </motion.p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Event Description <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-2.5 top-2 text-neutral-400 w-3.5 h-3.5" />
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                        placeholder="Describe your event in detail..."
                                        rows={3}
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all resize-none text-xs shadow-sm hover:shadow-md",
                                            displayErrors.description
                                                ? "border-red-400 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                                                : "border-neutral-200 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white"
                                        )}
                                    />
                                </div>
                                {displayErrors.description && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                        className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                                    >
                                        <span>•</span>
                                        {displayErrors.description}
                                    </motion.p>
                                )}
                            </div>

                            {/* Number of Attendees */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Number of Attendees <span className="text-neutral-400">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                    <input
                                        type="number"
                                        value={formData.maxAttendees}
                                        onChange={(e) => updateField("maxAttendees", e.target.value)}
                                        placeholder="Unlimited"
                                        min="1"
                                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all text-xs shadow-sm hover:shadow-md"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Date/Time and Venue */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="space-y-4"
                        >
                            {/* Event Date */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Event Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                    <input
                                        type="date"
                                        value={formData.eventDate}
                                        onChange={(e) => updateField("eventDate", e.target.value)}
                                        min={getMinDate()}
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-xs shadow-sm hover:shadow-md",
                                            displayErrors.eventDate
                                                ? "border-red-400 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                                                : "border-neutral-200 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white"
                                        )}
                                    />
                                </div>
                                {displayErrors.eventDate && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                        className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                                    >
                                        <span>•</span>
                                        {displayErrors.eventDate}
                                    </motion.p>
                                )}
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => updateField("startTime", e.target.value)}
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-xs shadow-sm hover:shadow-md",
                                            displayErrors.startTime
                                                ? "border-red-400 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                                                : "border-neutral-200 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white"
                                        )}
                                    />
                                </div>
                                {displayErrors.startTime && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                        className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                                    >
                                        <span>•</span>
                                        {displayErrors.startTime}
                                    </motion.p>
                                )}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    End Time <span className="text-neutral-400">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => updateField("endTime", e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all text-xs shadow-sm hover:shadow-md"
                                    />
                                </div>
                            </div>

                            {/* Venue */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Venue <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => updateField("location", e.target.value)}
                                        placeholder="Enter venue or online link"
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all text-xs shadow-sm hover:shadow-md",
                                            displayErrors.location
                                                ? "border-red-400 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                                                : "border-neutral-200 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white"
                                        )}
                                    />
                                </div>
                                {displayErrors.location && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                        className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                                    >
                                        <span>•</span>
                                        {displayErrors.location}
                                    </motion.p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                    <select
                                        value={formData.category}
                                        onChange={(e) => updateField("category", e.target.value)}
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-xs shadow-sm hover:shadow-md appearance-none",
                                            displayErrors.category
                                                ? "border-red-400 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                                                : "border-neutral-200 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white"
                                        )}
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none rotate-90" />
                                </div>
                                {displayErrors.category && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                        className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                                    >
                                        <span>•</span>
                                        {displayErrors.category}
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Submit Error */}
            {submitError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    className="mx-4 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400"
                >
                    {submitError}
                </motion.div>
            )}

            {/* Navigation Actions */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Previous
                        </button>
                    )}
                </div>

                {currentStep < 2 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting || !isStep1Valid}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                            !isStep1Valid
                                ? "bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-100 dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-600 dark:hover:from-neutral-200 dark:hover:to-neutral-50 hover:shadow-lg"
                        )}
                    >
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isStep2Valid}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                            !isStep2Valid
                                ? "bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-100 dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-600 dark:hover:from-neutral-200 dark:hover:to-neutral-50 hover:shadow-lg"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                Create Event
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

