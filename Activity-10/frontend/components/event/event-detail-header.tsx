"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Edit, Share2, Trash2, Loader2, AlertTriangle, UserPlus, UserMinus, CheckCircle, LogIn, Ticket, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { EventDetail } from "@/lib/api";

interface EventDetailHeaderProps {
    event: EventDetail;
    user: { id: string } | null;
    isOrganizer: boolean;
    hasJoined: boolean;
    canJoin: boolean;
    isJoining: boolean;
    isLeaving: boolean;
    hasTicket: boolean;
    onJoin: () => Promise<void>;
    onLeave: () => Promise<void>;
    onDelete: () => Promise<void>;
    onViewTicket: () => void;
    onViewAttendees: () => void;
    onEdit: () => void;
    onShare: () => void;
    isDeleting: boolean;
}

// Helper function to get attendee status for current user
function getUserAttendeeStatus(event: EventDetail, userId: number | null): "registered" | "confirmed" | null {
    if (!userId || !event?.attendeeList) return null;
    const attendee = event.attendeeList.find((a) => a.userId === userId);
    if (!attendee) return null;
    if (attendee.status === "confirmed") return "confirmed";
    if (attendee.status === "registered") return "registered";
    return null;
}

const STATUS_STYLES = {
    upcoming: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        label: "Upcoming",
    },
    ongoing: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "Ongoing",
    },
    completed: {
        bg: "bg-neutral-100 dark:bg-neutral-800",
        text: "text-neutral-600 dark:text-neutral-400",
        label: "Completed",
    },
    cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        label: "Cancelled",
    },
};

// Generate initials from name
function getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

// Generate a consistent color based on the name
function getAvatarColor(name: string): string {
    const colors = [
        'bg-rose-500',
        'bg-pink-500',
        'bg-fuchsia-500',
        'bg-purple-500',
        'bg-violet-500',
        'bg-indigo-500',
        'bg-blue-500',
        'bg-sky-500',
        'bg-cyan-500',
        'bg-teal-500',
        'bg-emerald-500',
        'bg-green-500',
        'bg-lime-500',
        'bg-amber-500',
        'bg-orange-500',
        'bg-red-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export function EventDetailHeader({ 
    event, 
    user,
    isOrganizer, 
    hasJoined,
    canJoin,
    isJoining,
    isLeaving,
    hasTicket,
    onJoin,
    onLeave,
    onDelete,
    onViewTicket,
    onViewAttendees,
    onEdit,
    onShare,
    isDeleting 
}: EventDetailHeaderProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const status = STATUS_STYLES[event.status];

    const organizerName = event.organizerName || 'Unknown Organizer';
    const initials = getInitials(organizerName);
    const avatarColor = getAvatarColor(organizerName);

    const handleDelete = async () => {
        await onDelete();
        setShowDeleteConfirm(false);
    };

    // Render join/leave button
    const renderJoinButton = () => {
        if (isOrganizer) return null;

        if (!user) {
            return (
                <Link
                    href="/signin"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0"
                >
                    <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Sign in to Join</span>
                    <span className="sm:hidden">Sign in</span>
                </Link>
            );
        }

        if (hasJoined) {
            // Check if current user's attendee status
            const userId = user ? parseInt(user.id) : null;
            const attendeeStatus = getUserAttendeeStatus(event, userId);
            const isVerified = attendeeStatus === "confirmed";
            
            // Only show ticket button if ticket exists and event is not completed
            const canViewTicket = hasTicket && event.status !== "completed";
            
            return (
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {canViewTicket && (
                        <button
                            onClick={onViewTicket}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0"
                        >
                            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">View Ticket</span>
                            <span className="xs:hidden">Ticket</span>
                        </button>
                    )}
                    <button
                        onClick={() => setShowLeaveConfirm(true)}
                        disabled={isLeaving}
                        className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 shrink-0 ${
                            isVerified 
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        }`}
                    >
                        {isLeaving ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                <span className="hidden xs:inline">Leaving...</span>
                                <span className="xs:hidden">...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isVerified ? "text-blue-500" : "text-emerald-500"}`} />
                                <span className="hidden xs:inline">{isVerified ? "Verified" : "Joined"}</span>
                                <span className="xs:hidden">✓</span>
                            </>
                        )}
                    </button>
                </div>
            );
        }

        if (canJoin) {
            return (
                <button
                    onClick={onJoin}
                    disabled={isJoining}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 shrink-0"
                >
                    {isJoining ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            <span className="hidden xs:inline">Joining...</span>
                            <span className="xs:hidden">...</span>
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Join Event</span>
                            <span className="xs:hidden">Join</span>
                        </>
                    )}
                </button>
            );
        }

        return (
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-lg text-xs sm:text-sm shrink-0">
                {event.status === "cancelled" ? "Cancelled" : 
                 event.status === "completed" ? "Ended" : "Full"}
            </span>
        );
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-6"
            >
                {/* Back button + Badges row */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Link
                        href={user ? "/my-events" : "/events"}
                        className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
                    </Link>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span
                            className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                        >
                            {status.label}
                        </span>
                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            {event.category}
                        </span>
                    </div>
                </div>

                {/* Event Name + Join Button row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white leading-tight">
                        {event.title}
                    </h1>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {renderJoinButton()}
                        {/* Share button - visible to everyone */}
                        <button 
                            onClick={onShare}
                            className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors relative"
                            title="Share event"
                        >
                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        {/* Organizer buttons */}
                        {isOrganizer && (
                            <>
                                <button
                                    onClick={onViewAttendees}
                                    className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                    title="View Attendees"
                                >
                                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
                                </button>
                                <button 
                                    onClick={onEdit}
                                    disabled={event.status === "completed" || event.status === "cancelled"}
                                    className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={event.status === "completed" || event.status === "cancelled" ? "Cannot edit completed or cancelled events" : "Edit event"}
                                >
                                    <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
                                </button>
                                <button 
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-colors group"
                                >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Avatar + Organizer Name row */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                    {event.organizationId ? (
                        event.organizationLogo ? (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 overflow-hidden">
                                <img 
                                    src={event.organizationLogo} 
                                    alt={event.organizationName || 'Organization'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                        )
                    ) : (
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${avatarColor} flex items-center justify-center shrink-0`}>
                            <span className="text-xs font-semibold text-white">
                                {initials}
                            </span>
                        </div>
                    )}
                    <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        Organized by <span className="font-medium text-neutral-900 dark:text-white">{organizerName}</span>
                    </span>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 max-w-md w-full mx-4 shadow-xl"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                                        Delete Event
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6">
                                Are you sure you want to delete <span className="font-medium text-neutral-900 dark:text-white">&quot;{event.title}&quot;</span>? 
                                All attendees will be notified and removed from this event.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex-1 sm:flex-initial"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                            <span className="hidden xs:inline">Deleting...</span>
                                            <span className="xs:hidden">...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="hidden xs:inline">Delete Event</span>
                                            <span className="xs:hidden">Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Leave Confirmation Modal */}
            <AnimatePresence>
                {showLeaveConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !isLeaving && setShowLeaveConfirm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 max-w-sm w-full mx-4 shadow-xl"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                    <UserMinus className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                                        Leave Event
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                        Cancel your registration
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6">
                                Are you sure you want to leave <span className="font-medium text-neutral-900 dark:text-white">&quot;{event.title}&quot;</span>? 
                                You can rejoin later if spots are still available.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:justify-end">
                                <button
                                    onClick={() => setShowLeaveConfirm(false)}
                                    disabled={isLeaving}
                                    className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        await onLeave();
                                        setShowLeaveConfirm(false);
                                    }}
                                    disabled={isLeaving}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 flex-1 sm:flex-initial"
                                >
                                    {isLeaving ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                            <span className="hidden xs:inline">Leaving...</span>
                                            <span className="xs:hidden">...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="hidden xs:inline">Leave Event</span>
                                            <span className="xs:hidden">Leave</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
}

