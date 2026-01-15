"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Users, QrCode, Search, Download, Mail, Send } from "lucide-react";
import { EventDetail, VerifyAttendeeAttendee, sendAttendeeNotifications } from "@/lib/api";
import { QRScannerModal } from "./qr-scanner-modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AttendeeListModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: EventDetail;
    onVerifyAttendee: (ticketCode: string) => Promise<{ success: boolean; message: string; attendee?: VerifyAttendeeAttendee }>;
}

export function AttendeeListModal({
    isOpen,
    onClose,
    event,
    onVerifyAttendee,
}: AttendeeListModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);

    // Filter attendees based on search query
    const filteredAttendees = event.attendeeList?.filter((attendee) => {
        if (!searchQuery) return true;
        const email = attendee.user?.email || "";
        return email.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

    // Send email notification to all attendees
    const handleSendEmailNotification = async () => {
        const attendees = event.attendeeList || [];
        
        if (attendees.length === 0) {
            return;
        }

        setIsSendingEmail(true);
        setEmailSuccess(false);

        try {
            const result = await sendAttendeeNotifications(event.id);
            
            if (result.success) {
                setEmailSuccess(true);
                setTimeout(() => setEmailSuccess(false), 3000);
            } else {
                alert(result.message || 'Failed to send email notifications. Please try again.');
            }
        } catch (error) {
            console.error('Failed to send email notifications:', error);
            alert('Failed to send email notifications. Please try again.');
        } finally {
            setIsSendingEmail(false);
        }
    };

    // Download PDF function
    const handleDownloadPDF = () => {
        // Use all attendees, not just filtered ones
        const attendees = event.attendeeList || [];
        
        if (attendees.length === 0) {
            return;
        }

        // Create new PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text("Attendee List", 14, 22);
        
        // Add event information
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Event: ${event.title}`, 14, 32);
        doc.setFont("helvetica", "normal");
        const eventDate = event.date ? new Date(event.date).toLocaleDateString() : "N/A";
        doc.text(`Date: ${eventDate}`, 14, 38);
        doc.text(`Total Attendees: ${attendees.length}`, 14, 44);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 50);
        
        // Prepare table data
        const tableData = attendees.map((attendee) => {
            const email = attendee.user?.email || `User ID: ${attendee.userId}`;
            const registeredAt = new Date(attendee.registeredAt).toLocaleString();
            return [
                attendee.id.toString(),
                attendee.userId.toString(),
                email,
                attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1),
                registeredAt,
            ];
        });

        // Add table using autoTable
        autoTable(doc, {
            startY: 56,
            head: [["ID", "User ID", "Email", "Status", "Registered At"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [55, 65, 81], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            margin: { top: 56, left: 14, right: 14 },
        });

        // Save PDF
        const fileName = `attendees-${event.title.replace(/[^a-z0-9]/gi, "_")}-${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 p-4 sm:p-6 text-white">
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                                >
                                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>

                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pr-8">
                                    <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 shrink-0">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-base sm:text-lg font-bold">
                                            Attendee List
                                        </h2>
                                        <p className="text-xs sm:text-sm text-white/70">
                                            {event.attendees} {event.attendees === 1 ? "attendee" : "attendees"}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={handleSendEmailNotification}
                                        disabled={!event.attendeeList || event.attendeeList.length === 0 || isSendingEmail}
                                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                    >
                                        {isSendingEmail ? (
                                            <>
                                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : emailSuccess ? (
                                            <>
                                                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Sent!
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Email All
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={!event.attendeeList || event.attendeeList.length === 0}
                                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => setIsQRScannerOpen(true)}
                                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                                    >
                                        <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        QR Scanner
                                    </button>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by email..."
                                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400"
                                    />
                                </div>
                            </div>

                            {/* Attendee List */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                {filteredAttendees.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {searchQuery ? "No attendees found matching your search" : "No attendees yet"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredAttendees.map((attendee) => (
                                            <div
                                                key={attendee.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                                                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                                            {attendee.user?.email?.[0]?.toUpperCase() || "?"}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white truncate">
                                                            {attendee.user?.email || `User ID: ${attendee.userId}`}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            Registered {new Date(attendee.registeredAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                            attendee.status === "registered"
                                                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                                                : attendee.status === "confirmed"
                                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                                                        }`}
                                                    >
                                                        {attendee.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* QR Scanner Modal */}
            <QRScannerModal
                isOpen={isQRScannerOpen}
                onClose={() => setIsQRScannerOpen(false)}
                eventId={event.id}
                eventName={event.title}
                onVerifyAttendee={onVerifyAttendee}
            />
        </>
    );
}
