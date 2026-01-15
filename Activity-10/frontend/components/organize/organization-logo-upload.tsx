"use client";

import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface OrganizationLogoUploadProps {
    logo: string;
    logoPreview: string | null;
    onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLogoUrlChange: (url: string) => void;
    onRemoveLogo: () => void;
    id?: string;
}

export function OrganizationLogoUpload({
    logo,
    logoPreview,
    onLogoUpload,
    onLogoUrlChange,
    onRemoveLogo,
    id = "logo-upload",
}: OrganizationLogoUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Organization Logo
            </label>
            
            {/* Logo Preview */}
            {logoPreview && (
                <div className="relative mb-3 w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-cover"
                        unoptimized={logoPreview.startsWith('data:')}
                    />
                    <button
                        type="button"
                        onClick={onRemoveLogo}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Options */}
            <div className="space-y-2">
                {/* File Upload */}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onLogoUpload}
                        className="hidden"
                        id={id}
                    />
                    <label
                        htmlFor={id}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Logo
                    </label>
                </div>

                {/* Or Divider */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                    <span className="text-xs text-neutral-500">OR</span>
                    <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                </div>

                {/* URL Input */}
                <div>
                    <input
                        type="url"
                        value={logo}
                        onChange={(e) => onLogoUrlChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                        placeholder="Enter logo URL"
                    />
                </div>
            </div>

            {!logoPreview && !logo && (
                <div className="mt-2 flex items-center justify-center w-full h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                    <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-1" />
                        <p className="text-xs text-neutral-500">No logo selected</p>
                    </div>
                </div>
            )}
        </div>
    );
}

