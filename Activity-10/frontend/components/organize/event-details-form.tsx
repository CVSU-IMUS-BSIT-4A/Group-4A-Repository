"use client";

import { cn } from "@/lib/utils";

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

interface EventDetailsFormProps {
    eventFormData: EventFormData;
    errors: Record<string, string>;
    onFieldChange: (field: keyof EventFormData, value: string) => void;
    selectedOrganizationName?: string;
}

export function EventDetailsForm({
    eventFormData,
    errors,
    onFieldChange,
    selectedOrganizationName,
}: EventDetailsFormProps) {
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    return (
        <div className="space-y-4">
            {selectedOrganizationName && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Creating event for: <strong>{selectedOrganizationName}</strong>
                    </p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Event Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={eventFormData.title}
                    onChange={(e) => onFieldChange("title", e.target.value)}
                    className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                        errors.title ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                    )}
                    placeholder="Enter event title"
                />
                {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={eventFormData.description}
                    onChange={(e) => onFieldChange("description", e.target.value)}
                    rows={4}
                    className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white resize-none",
                        errors.description ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                    )}
                    placeholder="Describe your event"
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Event Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={eventFormData.eventDate}
                        onChange={(e) => onFieldChange("eventDate", e.target.value)}
                        min={getMinDate()}
                        className={cn(
                            "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                            errors.eventDate ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                        )}
                    />
                    {errors.eventDate && (
                        <p className="mt-1 text-xs text-red-500">{errors.eventDate}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={eventFormData.category}
                        onChange={(e) => onFieldChange("category", e.target.value)}
                        className={cn(
                            "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                            errors.category ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                        )}
                    >
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        value={eventFormData.startTime}
                        onChange={(e) => onFieldChange("startTime", e.target.value)}
                        className={cn(
                            "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                            errors.startTime ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                        )}
                    />
                    {errors.startTime && (
                        <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        End Time
                    </label>
                    <input
                        type="time"
                        value={eventFormData.endTime}
                        onChange={(e) => onFieldChange("endTime", e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Location <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => onFieldChange("location", e.target.value)}
                    className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                        errors.location ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                    )}
                    placeholder="Enter event location"
                />
                {errors.location && (
                    <p className="mt-1 text-xs text-red-500">{errors.location}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Maximum Attendees
                </label>
                <input
                    type="number"
                    value={eventFormData.maxAttendees}
                    onChange={(e) => onFieldChange("maxAttendees", e.target.value)}
                    min="1"
                    className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                        errors.maxAttendees ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                    )}
                    placeholder="Leave empty for unlimited"
                />
                {errors.maxAttendees && (
                    <p className="mt-1 text-xs text-red-500">{errors.maxAttendees}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Event Banner (URL)
                </label>
                <input
                    type="url"
                    value={eventFormData.image}
                    onChange={(e) => onFieldChange("image", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                    placeholder="https://example.com/image.jpg"
                />
            </div>
        </div>
    );
}

export { CATEGORIES };

