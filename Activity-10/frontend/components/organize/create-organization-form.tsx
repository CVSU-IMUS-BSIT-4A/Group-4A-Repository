"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationLogoUpload } from "./organization-logo-upload";

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

interface CreateOrganizationFormProps {
    orgFormData: OrganizationFormData;
    errors: Record<string, string>;
    logoPreview: string | null;
    onFieldChange: (field: keyof OrganizationFormData, value: string | number | undefined) => void;
    onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLogoUrlChange: (url: string) => void;
    onRemoveLogo: () => void;
    showPendingInfo?: boolean;
    uploadId?: string;
}

export function CreateOrganizationForm({
    orgFormData,
    errors,
    logoPreview,
    onFieldChange,
    onLogoUpload,
    onLogoUrlChange,
    onRemoveLogo,
    showPendingInfo = true,
    uploadId = "logo-upload",
}: CreateOrganizationFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={orgFormData.name}
                    onChange={(e) => onFieldChange("name", e.target.value)}
                    className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                        errors.name ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                    )}
                    placeholder="Enter organization name"
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={orgFormData.description}
                    onChange={(e) => onFieldChange("description", e.target.value)}
                    rows={3}
                    className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white resize-none",
                        errors.description ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                    )}
                    placeholder="Describe your organization"
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={orgFormData.email}
                        onChange={(e) => onFieldChange("email", e.target.value)}
                        className={cn(
                            "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                            errors.email ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                        )}
                        placeholder="contact@org.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={orgFormData.phone}
                        onChange={(e) => onFieldChange("phone", e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                        placeholder="+1234567890"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Website
                </label>
                <input
                    type="url"
                    value={orgFormData.website}
                    onChange={(e) => {
                        let value = e.target.value;
                        // Auto-prepend https:// if user starts typing without protocol
                        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                            value = 'https://' + value;
                        }
                        onFieldChange("website", value);
                    }}
                    onFocus={(e) => {
                        // Auto-set https:// when focused if empty
                        if (!e.target.value) {
                            onFieldChange("website", "https://");
                        }
                    }}
                    className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white",
                        errors.website ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                    )}
                    placeholder="https://example.com"
                />
                {errors.website && (
                    <p className="mt-1 text-xs text-red-500">{errors.website}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Address
                </label>
                <input
                    type="text"
                    value={orgFormData.address}
                    onChange={(e) => onFieldChange("address", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                    placeholder="123 Main St, City, Country"
                />
            </div>

            <OrganizationLogoUpload
                logo={orgFormData.logo}
                logoPreview={logoPreview}
                onLogoUpload={onLogoUpload}
                onLogoUrlChange={onLogoUrlChange}
                onRemoveLogo={onRemoveLogo}
                id={uploadId}
            />

            {showPendingInfo && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Your organization will be created with <strong>pending</strong> status. An admin will review and verify it before it becomes active. {uploadId === "logo-upload-step1" ? "You can still create events, but they may show as pending until verification." : "Once approved, you'll be able to create events as this organization."}
                    </p>
                </div>
            )}
        </div>
    );
}

