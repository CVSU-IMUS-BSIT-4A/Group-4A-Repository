"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    getEventById,
    deleteEvent,
    joinEvent,
    leaveEvent,
    getUserTicket,
    verifyAttendee,
    EventDetail,
} from "@/lib/api";

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
}

interface TicketData {
    ticketCode: string;
    qrCode: string;
    eventTitle: string;
    eventDate: string | Date;
    eventTime: string;
    location: string;
    status: string;
    registeredAt: string | Date;
}

export function useEventDetail(eventId: string) {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ticket, setTicket] = useState<TicketData | null>(null);
    const [isLoadingTicket, setIsLoadingTicket] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch {
                // Continue without user
            }
        }
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) {
                setError("Invalid event ID");
                setIsLoading(false);
                return;
            }

            const id = parseInt(eventId);
            if (isNaN(id)) {
                setError("Invalid event ID");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await getEventById(id);
                setEvent(response.data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load event"
                );
            } finally {
                setIsLoading(false);
            }
        };

        void fetchEvent();
    }, [eventId]);

    const isOrganizer = user && event && parseInt(user.id) === event.organizerId;

    // Check if current user has joined the event (registered or confirmed status)
    const hasJoined = useMemo(() => {
        if (!user || !event?.attendeeList) return false;
        const userId = parseInt(user.id);
        return event.attendeeList.some(
            (attendee) => 
                attendee.userId === userId && 
                (attendee.status === "registered" || attendee.status === "confirmed")
        );
    }, [user, event?.attendeeList]);

    // Check if event is joinable
    const canJoin = useMemo(() => {
        if (!event || !user) return false;
        if (isOrganizer) return false;
        if (event.status === "cancelled" || event.status === "completed") return false;
        if (event.maxAttendees && event.attendees >= event.maxAttendees) return false;
        return true;
    }, [event, user, isOrganizer]);

    const formatDate = (date: string | Date) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (time: string) => {
        // Convert 24h to 12h format if needed
        const [hours, minutes] = time.split(":");
        const h = parseInt(hours);
        if (isNaN(h)) return time;
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const handleDelete = useCallback(async () => {
        if (!event || !user) return;

        setIsDeleting(true);
        try {
            await deleteEvent(event.id, parseInt(user.id));
            router.push("/my-events");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete event"
            );
            setIsDeleting(false);
        }
    }, [event, user, router]);

    const handleJoin = useCallback(async () => {
        if (!event || !user) return;

        setIsJoining(true);
        setActionMessage(null);
        setError(null);

        try {
            const response = await joinEvent(event.id, parseInt(user.id));
            setActionMessage(response.message);

            // Store ticket info if returned
            if (response.ticket) {
                setTicket({
                    ticketCode: response.ticket.ticketCode,
                    qrCode: response.ticket.qrCode,
                    eventTitle: event.title,
                    eventDate: event.date,
                    eventTime: event.time,
                    location: event.location,
                    status: "registered",
                    registeredAt: new Date().toISOString(),
                });
            }

            // Refresh event data to update attendee count
            const updatedEvent = await getEventById(event.id);
            setEvent(updatedEvent.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to join event"
            );
        } finally {
            setIsJoining(false);
        }
    }, [event, user]);

    const handleLeave = useCallback(async () => {
        if (!event || !user) return;

        setIsLeaving(true);
        setActionMessage(null);
        setError(null);

        try {
            const response = await leaveEvent(event.id, parseInt(user.id));
            setActionMessage(response.message);
            // Refresh event data to update attendee count
            const updatedEvent = await getEventById(event.id);
            setEvent(updatedEvent.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to leave event"
            );
        } finally {
            setIsLeaving(false);
        }
    }, [event, user]);

    // Store stable event and user IDs for dependency arrays
    const currentEventId = event?.id;
    const currentEventStatus = event?.status;
    const currentUserId = user?.id ? parseInt(user.id) : null;

    // Fetch ticket if user has joined and event is not completed
    const fetchTicket = useCallback(async () => {
        if (!event || !user || !hasJoined || !currentEventId || !currentUserId) return;

        // Don't fetch ticket if event is completed - tickets are no longer available after event ends
        if (currentEventStatus === "completed") {
            setTicket(null);
            return;
        }

        setIsLoadingTicket(true);
        try {
            const response = await getUserTicket(currentEventId, currentUserId);
            setTicket(response.data);
        } catch (err) {
            // If ticket not found (e.g., event completed), clear ticket
            if (err instanceof Error && err.message.includes("completed")) {
                setTicket(null);
            } else {
                console.error("Failed to fetch ticket:", err);
            }
        } finally {
            setIsLoadingTicket(false);
        }
    }, [event, user, hasJoined, currentEventId, currentEventStatus, currentUserId]);

    const handleVerifyAttendee = useCallback(async (ticketCode: string) => {
        if (!event || !user) {
            return {
                success: false,
                message: "You must be logged in to verify attendees",
            };
        }

        try {
            const result = await verifyAttendee(event.id, ticketCode);
            // Refresh event data to update attendee list with new status
            const updatedEvent = await getEventById(event.id);
            setEvent(updatedEvent.data);
            
            // If the verified attendee is the current user, refresh their ticket
            if (result.success && result.attendee && result.attendee.userId === parseInt(user.id)) {
                // Fetch ticket after successful verification of current user's ticket
                // This ensures the ticket is available for viewing
                try {
                    const ticketResponse = await getUserTicket(event.id, parseInt(user.id));
                    setTicket(ticketResponse.data);
                } catch {
                    // If ticket fetch fails, try using fetchTicket function
                    void fetchTicket();
                }
            }
            
            return result;
        } catch (err) {
            return {
                success: false,
                message: err instanceof Error ? err.message : "Failed to verify attendee",
            };
        }
    }, [event, user, fetchTicket]);

    const handleEdit = useCallback(async () => {
        // This function just triggers the edit modal to open
        // The actual update logic is in the EditEventModal component
        // We return a promise that resolves when editing is needed
        return Promise.resolve();
    }, []);

    const handleEventUpdate = useCallback(async () => {
        // Refresh event data after successful update
        if (!eventId) return;
        
        const id = parseInt(eventId);
        if (isNaN(id)) return;

        try {
            const response = await getEventById(id);
            setEvent(response.data);
            setActionMessage("Event updated successfully");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to refresh event"
            );
        }
    }, [eventId]);

    const clearMessages = useCallback(() => {
        setActionMessage(null);
        setError(null);
    }, []);

    // Auto-fetch ticket when user has joined (only if event is not completed)
    useEffect(() => {
        if (!event || !user || !currentEventId) return;
        
        if (hasJoined && currentEventStatus !== "completed" && !ticket) {
            void fetchTicket();
        } else if (currentEventStatus === "completed") {
            // Clear ticket if event is completed
            setTicket(null);
        }
    }, [hasJoined, currentEventStatus, currentEventId, currentUserId, ticket, fetchTicket, event, user]);

    return {
        user,
        event,
        isLoading,
        isDeleting,
        isJoining,
        isLeaving,
        error,
        actionMessage,
        isOrganizer,
        hasJoined,
        canJoin,
        ticket,
        isLoadingTicket,
        formatDate,
        formatTime,
        handleDelete,
        handleJoin,
        handleLeave,
        handleVerifyAttendee,
        handleEdit,
        handleEventUpdate,
        clearMessages,
        fetchTicket,
        router,
    };
}

