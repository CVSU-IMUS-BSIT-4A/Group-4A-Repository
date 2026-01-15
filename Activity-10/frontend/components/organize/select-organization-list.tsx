"use client";

import { Check, Building2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Organization } from "@/lib/api";

interface SelectOrganizationListProps {
    organizations: Organization[];
    selectedOrganizationId?: number;
    onSelect: (organizationId: number) => void;
}

export function SelectOrganizationList({
    organizations,
    selectedOrganizationId,
    onSelect,
}: SelectOrganizationListProps) {
    return (
        <div className="space-y-3">
            {organizations.map((org) => (
                <button
                    key={org.id}
                    type="button"
                    onClick={() => onSelect(org.id)}
                    className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-all",
                        selectedOrganizationId === org.id
                            ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                    )}
                >
                    <div className="flex items-start gap-3">
                        {org.logo ? (
                            <Image
                                src={org.logo}
                                alt={org.name}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-neutral-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                                {org.name}
                            </h4>
                            {org.description && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                    {org.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                    Approved
                                </span>
                            </div>
                        </div>
                        {selectedOrganizationId === org.id && (
                            <Check className="w-5 h-5 text-neutral-900 dark:text-white shrink-0" />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}

