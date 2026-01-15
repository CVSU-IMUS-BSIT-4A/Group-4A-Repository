"use client";

import { use, useState, useEffect } from "react";
import { useEventDetail } from "@/hooks/event";
import { Navbar } from "@/components/ui/navbar";
import { BeamsBackground } from "@/components/ui/beams-background";
import {
    EventDetailHeader,
    EventDetailBanner,
    EventDetailInfo,
    EventDetailLoading,
    EventDetailError,
    EventTicketModal,
    AttendeeListModal,
    EditEventModal,
    ShareEventModal,
} from "@/components/event";

interface EventPageProps {
    params: Promise<{ id: string }>;
}

export default function EventPage({ params }: EventPageProps) {
    const resolvedParams = use(params);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isAttendeeListModalOpen, setIsAttendeeListModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const {
        user,
        event,
        isLoading,
        isDeleting,
        isJoining,
        isLeaving,
        error,
        isOrganizer,
        hasJoined,
        canJoin,
        ticket,
        formatDate,
        formatTime,
        handleDelete,
        handleJoin,
        handleLeave,
        handleVerifyAttendee,
        handleEventUpdate,
    } = useEventDetail(resolvedParams.id);

    const userName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
        : "Guest";

    // Update document title with event name
    useEffect(() => {
        if (event?.title) {
            document.title = `${event.title} - Occasio`;
        } else if (isLoading === false && error) {
            document.title = "Event Not Found - Occasio";
        }
    }, [event?.title, isLoading, error]);

    return (
        <div className="min-h-screen flex flex-col relative">
            <BeamsBackground
                intensity="subtle"
                className="fixed! z-0!"
                hideContent={true}
            />

            <Navbar showCenterNav={false} />

            <main className="flex-1 flex flex-col pt-16 sm:pt-20 pb-6 sm:pb-8 px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto w-full">
                    {isLoading ? (
                        <EventDetailLoading />
                    ) : error ? (
                        <EventDetailError error={error} />
                    ) : event ? (
                        <>
                            <EventDetailHeader
                                event={event}
                                user={user}
                                isOrganizer={isOrganizer || false}
                                hasJoined={hasJoined || false}
                                canJoin={canJoin || false}
                                isJoining={isJoining}
                                isLeaving={isLeaving}
                                hasTicket={!!ticket && event.status !== "completed"}
                                onJoin={handleJoin}
                                onLeave={handleLeave}
                                onDelete={handleDelete}
                                onViewTicket={() => setIsTicketModalOpen(true)}
                                onViewAttendees={() => setIsAttendeeListModalOpen(true)}
                                onEdit={() => setIsEditModalOpen(true)}
                                onShare={() => setIsShareModalOpen(true)}
                                isDeleting={isDeleting}
                            />
                            <EventDetailBanner event={event} />
                            <EventDetailInfo
                                event={event}
                                formatDate={formatDate}
                                formatTime={formatTime}
                            />

                            {/* Ticket Modal */}
                            <EventTicketModal
                                isOpen={isTicketModalOpen}
                                onClose={() => setIsTicketModalOpen(false)}
                                ticket={ticket}
                                userName={userName}
                                formatDate={formatDate}
                                formatTime={formatTime}
                            />

                            {/* Attendee List Modal */}
                            {event && (
                                <AttendeeListModal
                                    isOpen={isAttendeeListModalOpen}
                                    onClose={() => setIsAttendeeListModalOpen(false)}
                                    event={event}
                                    onVerifyAttendee={handleVerifyAttendee}
                                />
                            )}

                            {/* Edit Event Modal */}
                            {event && (
                                <EditEventModal
                                    isOpen={isEditModalOpen}
                                    event={event}
                                    onClose={() => setIsEditModalOpen(false)}
                                    onSuccess={async () => {
                                        await handleEventUpdate();
                                    }}
                                />
                            )}

                            {/* Share Event Modal */}
                            {event && (
                                <ShareEventModal
                                    isOpen={isShareModalOpen}
                                    onClose={() => setIsShareModalOpen(false)}
                                    eventId={event.id}
                                    eventTitle={event.title}
                                />
                            )}
                        </>
                    ) : (
                        <EventDetailError error="Event not found" />
                    )}
                </div>
            </main>
        </div>
    );
}

