"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2, Calendar, Clock, MapPin, Users, FileText, Type, ArrowLeft, Upload, X, Image as ImageIcon, ChevronRight, Check, Tag } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { EventDetail } from "@/lib/api";
import { updateEvent } from "@/lib/api";

interface EditEventModalProps {
    isOpen: boolean;
    event: EventDetail;
    onClose: () => void;
    onSuccess: () => void;
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

// Helper function to convert time to "HH:MM" format (24-hour) for time input
// Handles various formats: "09:00", "09:00 AM", "12:00 PM PM", etc.
const convertToTimeInputFormat = (timeStr: string): string => {
    if (!timeStr || !timeStr.trim()) return "";
    
    let cleaned = timeStr.trim();
    
    // Remove any duplicate AM/PM patterns first (e.g., "12:00 PM PM" -> "12:00 PM")
    // Also handle cases like "12:00 AM PM" or any combination
    cleaned = cleaned.replace(/\s+(AM|PM)(\s+(AM|PM))+$/i, (match, firstAmPm) => ` ${firstAmPm}`);
    
    // If already in pure HH:MM format (24-hour, no AM/PM), return as is
    if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
        // Normalize to HH:MM format (2-digit hours)
        const parts = cleaned.split(':');
        return `${parts[0].padStart(2, "0")}:${parts[1]}`;
    }
    
    // Try to parse 12-hour format with AM/PM (e.g., "09:00 AM" or "9:00 PM")
    const match12h = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12h) {
        let hours = parseInt(match12h[1]);
        const minutes = match12h[2];
        const ampm = match12h[3].toUpperCase();
        
        // Convert 12-hour to 24-hour format
        if (ampm === "PM" && hours !== 12) {
            hours += 12;
        } else if (ampm === "AM" && hours === 12) {
            hours = 0;
        }
        
        return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }
    
    // If format is unknown, try to extract just the HH:MM part (first occurrence)
    const timeOnly = cleaned.match(/^(\d{1,2}):(\d{2})/);
    if (timeOnly) {
        // Extract and normalize
        const parts = timeOnly[0].split(':');
        return `${parts[0].padStart(2, "0")}:${parts[1]}`;
    }
    
    return "";
};

export function EditEventModal({ isOpen, event, onClose, onSuccess }: EditEventModalProps) {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formData, setFormData] = useState<FormData>({
        image: event.image || "",
        title: event.title || "",
        description: event.description || "",
        maxAttendees: event.maxAttendees?.toString() || "",
        eventDate: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
        startTime: convertToTimeInputFormat(event.time || ""),
        endTime: convertToTimeInputFormat(event.endTime || ""),
        location: event.location || "",
        category: event.category || "",
    });
    const [bannerPreview, setBannerPreview] = useState<string | null>(event.image || null);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update form data when event changes
    useEffect(() => {
        if (event && isOpen) {
            setFormData({
                image: event.image || "",
                title: event.title || "",
                description: event.description || "",
                maxAttendees: event.maxAttendees?.toString() || "",
                eventDate: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
                startTime: convertToTimeInputFormat(event.time || ""),
                endTime: convertToTimeInputFormat(event.endTime || ""),
                location: event.location || "",
                category: event.category || "",
            });
            setBannerPreview(event.image || null);
            setCurrentStep(1);
            setErrors({});
            setSubmitError("");
        }
    }, [event, isOpen]);

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
        setSubmitError("");
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
        }

        if (!formData.startTime || !formData.startTime.trim()) {
            stepErrors.startTime = "Start time is required";
        } else if (!/^\d{2}:\d{2}$/.test(formData.startTime)) {
            stepErrors.startTime = "Please select a valid time";
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

    // Merge display errors
    const displayErrors = useMemo(() => {
        const currentStepErrors = currentStep === 1 ? step1Errors : step2Errors;
        return { ...errors, ...currentStepErrors };
    }, [currentStep, step1Errors, step2Errors, errors]);

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
            const userData = localStorage.getItem("user");
            if (!userData) {
                throw new Error("You must be logged in to update events");
            }

            const user = JSON.parse(userData);
            const organizerId = parseInt(user.id);

            if (!organizerId || isNaN(organizerId)) {
                throw new Error("Invalid user ID");
            }

            // Backend expects time in "HH:MM" format (24-hour), same as time input provides
            const updateData = {
                organizerId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                eventDate: formData.eventDate,
                startTime: formData.startTime, // Already in "HH:MM" format from time input
                endTime: formData.endTime || undefined, // Already in "HH:MM" format from time input
                location: formData.location.trim(),
                category: formData.category,
                image: formData.image || undefined,
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
            };

            await updateEvent(event.id, updateData);
            onSuccess();
            onClose();
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : "Failed to update event. Please try again."
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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl"
                    >
                        <div className="flex flex-col h-full min-h-0 overflow-hidden">
                            {/* Header */}
                            <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                                        Edit Event
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                    </button>
                                </div>

                                {/* Step Indicator */}
                                <div className="flex items-center justify-between">
                                    {[1, 2].map((step, index) => (
                                        <div key={step} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center flex-1 relative z-10">
                                                <motion.div
                                                    className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-sm",
                                                        currentStep === step
                                                            ? "bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 scale-110 shadow-lg ring-2 ring-neutral-900/20 dark:ring-white/20"
                                                            : currentStep > step
                                                            ? "bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 shadow-md"
                                                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700"
                                                    )}
                                                    whileHover={currentStep >= step ? { scale: 1.05 } : {}}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                >
                                                    {currentStep > step ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        step
                                                    )}
                                                </motion.div>
                                                <p
                                                    className={cn(
                                                        "mt-1.5 text-[10px] font-medium transition-colors",
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
                                                <div className="flex-1 mx-2 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full relative overflow-hidden">
                                                    <motion.div
                                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-100 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: currentStep > step ? "100%" : "0%" }}
                                                        transition={{ duration: 0.4, ease: "easeInOut" }}
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
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
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
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.3 }}
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
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
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
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
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
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
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
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
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
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
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
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
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
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
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
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mx-4 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400"
                                >
                                    {submitError}
                                </motion.div>
                            )}

                            {/* Navigation Actions */}
                            <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    {currentStep > 1 && (
                                        <motion.button
                                            type="button"
                                            onClick={handlePrevious}
                                            disabled={isSubmitting}
                                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                        >
                                            <ArrowLeft className="w-3 h-3" />
                                            Previous
                                        </motion.button>
                                    )}
                                </div>

                                {currentStep < 2 ? (
                                    <motion.button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={isSubmitting || !isStep1Valid}
                                        whileHover={{ scale: isSubmitting || !isStep1Valid ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting || !isStep1Valid ? 1 : 0.98 }}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                            !isStep1Valid
                                                ? "bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed"
                                                : "bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-100 dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-600 dark:hover:from-neutral-200 dark:hover:to-neutral-50 hover:shadow-lg"
                                        )}
                                    >
                                        Next
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !isStep2Valid}
                                        whileHover={{ scale: isSubmitting || !isStep2Valid ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting || !isStep2Valid ? 1 : 0.98 }}
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
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                Update Event
                                                <Check className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
