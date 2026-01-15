"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Share2, Copy, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ShareEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: number;
    eventTitle: string;
}

export function ShareEventModal({
    isOpen,
    onClose,
    eventId,
    eventTitle,
}: ShareEventModalProps) {
    const [copied, setCopied] = useState(false);
    
    const eventUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/event/${eventId}`
        : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            // Fallback: select the input text
            const input = document.getElementById('event-url-input') as HTMLInputElement;
            if (input) {
                input.select();
                input.setSelectionRange(0, 99999);
            }
        }
    };

    const handleShare = async () => {
        // Try using Web Share API if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: eventTitle,
                    text: `Check out this event: ${eventTitle}`,
                    url: eventUrl,
                });
                onClose();
                return;
            } catch (err) {
                // User cancelled or error occurred, fall back to copy
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        }
        
        // Fallback to copy
        await handleCopy();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md w-full p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
                onClose={onClose}
            >
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <Share2 className="w-5 h-5 text-neutral-900 dark:text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                Share Event
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>

                    {/* Event Title */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Share this event with others
                    </p>

                    {/* URL Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Event Link
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="event-url-input"
                                type="text"
                                value={eventUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                            />
                            <button
                                onClick={handleCopy}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                    copied
                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                        : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Share Button (for native share) */}
                    {navigator.share && (
                        <button
                            onClick={handleShare}
                            className="w-full px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share via...</span>
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

