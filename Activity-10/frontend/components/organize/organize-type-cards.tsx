"use client";

import { motion, AnimatePresence } from "motion/react";
import { User, Building2, ChevronRight, AlertCircle, Clock, X } from "lucide-react";
import type { Organization } from "@/lib/api";

interface TypeCard {
    id: "individual" | "organization";
    title: string;
    description: string;
    icon: React.ReactNode;
}

const typeCards: TypeCard[] = [
    {
        id: "individual",
        title: "Individual",
        description: "Organize events as yourself",
        icon: <User className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
        id: "organization",
        title: "Organization",
        description: "Organize events as a company or group",
        icon: <Building2 className="w-5 h-5 md:w-6 md:h-6" />,
    },
];

interface OrganizeTypeCardsProps {
    onTypeSelect: (type: "individual" | "organization") => void;
    rejectedOrganizations?: Organization[];
    pendingOrganizations?: Organization[];
    onDismissRejected?: () => void;
}

export function OrganizeTypeCards({ 
    onTypeSelect, 
    rejectedOrganizations = [],
    pendingOrganizations = [],
    onDismissRejected,
}: OrganizeTypeCardsProps) {
    const hasRejected = rejectedOrganizations.length > 0;
    const hasPending = pendingOrganizations.length > 0;
    const isOrganizationDisabled = hasPending;

    return (
        <div className="space-y-4">
            {/* Pending Notice */}
            {hasPending && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4"
                >
                    <div className="flex gap-3">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                Organization Request{pendingOrganizations.length > 1 ? 's' : ''} Pending Approval
                            </h4>
                            <div className="space-y-2">
                                {pendingOrganizations.map((org) => (
                                    <div key={org.id} className="text-sm text-amber-800 dark:text-amber-300">
                                        <p className="font-medium">{org.name}</p>
                                        {org.description && (
                                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                                                {org.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                                Your organization request is awaiting admin verification. You cannot create new organization requests until this is reviewed. You can still organize events individually.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Rejection Notice */}
            <AnimatePresence>
                {hasRejected && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 relative"
                    >
                        <button
                            onClick={onDismissRejected}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Dismiss notification"
                        >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                        <div className="flex gap-3 pr-6">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                                    Organization Request{rejectedOrganizations.length > 1 ? 's' : ''} Rejected
                                </h4>
                                <div className="space-y-2">
                                    {rejectedOrganizations.map((org) => (
                                        <div key={org.id} className="text-sm text-red-800 dark:text-red-300">
                                            <p className="font-medium">{org.name}</p>
                                            {org.rejectionReason && (
                                                <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                                                    Reason: {org.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-red-700 dark:text-red-400 mt-2">
                                    You can create a new organization request or organize events individually.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Type Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
            >
                {typeCards.map((card, index) => {
                    const isDisabled = card.id === "organization" && isOrganizationDisabled;
                    
                    return (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.1, delay: index * 0.02 }}
                        >
                            <button
                                onClick={() => !isDisabled && onTypeSelect(card.id)}
                                disabled={isDisabled}
                                className={`group block w-full h-full text-left relative ${
                                    isDisabled ? 'cursor-not-allowed opacity-60' : ''
                                }`}
                            >
                                {/* Notification Badge for Organization card */}
                                {card.id === "organization" && (hasRejected || hasPending) && (
                                    <span className={`absolute -top-1 -right-1 z-10 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                                        hasPending ? 'bg-amber-500' : 'bg-red-500'
                                    }`} />
                                )}
                                
                                <div className={`h-full bg-white dark:bg-neutral-900 rounded-lg md:rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 md:p-4 transition-all duration-150 ${
                                    isDisabled 
                                        ? 'bg-neutral-50 dark:bg-neutral-950' 
                                        : 'hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg'
                                }`}>
                                    {/* Icon */}
                                    <div className={`inline-flex p-2 md:p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white mb-2 md:mb-3 transition-colors duration-150 ${
                                        !isDisabled && 'group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900'
                                    }`}>
                                        {card.icon}
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-white mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mb-4 md:mb-5">
                                        {card.description}
                                    </p>

                                    {/* CTA */}
                                    <div className={`flex items-center gap-1.5 text-xs md:text-sm font-medium text-neutral-900 dark:text-white transition-all duration-150 ${
                                        !isDisabled && 'group-hover:gap-2'
                                    }`}>
                                        {isDisabled ? 'Pending Approval' : 'Get Started'}
                                        {!isDisabled && <ChevronRight className="w-4 h-4 md:w-4 md:h-4" />}
                                    </div>
                                </div>
                            </button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
