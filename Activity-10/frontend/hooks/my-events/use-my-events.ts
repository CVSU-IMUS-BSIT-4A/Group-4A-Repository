"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserEvents, getUserOrganizations, type Organization } from "@/lib/api";

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    category: string;
    attendees: number;
    maxAttendees?: number;
    type: "joined" | "organized"; 
}

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
}

export type EventFilter = "all" | "upcoming" | "ongoing" | "completed";
export type EventType = "joined" | "organized";

// Items per page - 10 cards per page
const ITEMS_PER_PAGE = 10;

export function useMyEvents() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<UserData | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [eventType, setEventType] = useState<EventType>("joined");
    const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [shouldOpenOrganizeModal, setShouldOpenOrganizeModal] = useState(false);
    const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState(false);

    // Handle URL params for tab, refresh, and openOrganize (only on mount or when URL changes externally)
    useEffect(() => {
        const tab = searchParams.get("tab");
        const refresh = searchParams.get("refresh");
        const openOrganize = searchParams.get("openOrganize");

        // Only set event type from URL on initial load, or if URL tab differs from current state
        if (!hasInitializedFromUrl) {
        if (tab === "organized" || tab === "joined") {
                setEventType(tab);
            }
            setHasInitializedFromUrl(true);
        } else if (tab && (tab === "organized" || tab === "joined") && tab !== eventType) {
            // If URL changed externally (browser back/forward), sync state
            setEventType(tab);
        }

        if (refresh) {
            setRefreshKey(Date.now());
        }

        // Set flag to open organize modal if param is present
        if (openOrganize === "true") {
            setShouldOpenOrganizeModal(true);
        }

        // Clean up URL params (keep only tab)
        const paramsToKeep: string[] = [];
        const currentTab = tab || eventType;
        if (currentTab === "organized" || currentTab === "joined") {
            paramsToKeep.push(`tab=${currentTab}`);
        }
        const newUrl = paramsToKeep.length > 0 
            ? `/my-events?${paramsToKeep.join("&")}`
            : "/my-events";
        
        // Only update URL if it's different to avoid unnecessary updates
        const currentUrl = searchParams.toString();
        const newUrlParams = paramsToKeep.join("&");
        if (currentUrl !== newUrlParams) {
            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, router, hasInitializedFromUrl, eventType]);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/signin");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Load dismissed rejected org IDs from localStorage
            const dismissedKey = `dismissed_rejected_orgs_${parsedUser.id}`;
            const dismissedData = localStorage.getItem(dismissedKey);
            if (dismissedData) {
                try {
                    const dismissed = JSON.parse(dismissedData);
                    setDismissedRejectedIds(new Set(dismissed));
                } catch {
                    // Invalid data, ignore
                }
            }
        } catch {
            router.push("/signin");
            return;
        }
    }, [router]);

    // Fetch events when eventType, activeFilter, or currentPage changes
    useEffect(() => {
        if (!user?.id) return;

        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const userId = parseInt(user.id);
                if (!userId || isNaN(userId)) {
                    throw new Error("Invalid user ID");
                }

                const status = activeFilter !== "all" ? activeFilter : undefined;
                const response = await getUserEvents(
                    userId,
                    eventType,
                    status,
                    currentPage,
                    ITEMS_PER_PAGE
                );

                // Transform backend events to frontend format
                const transformedEvents: Event[] = response.events.map((event) => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    date: typeof event.date === 'string' ? event.date : event.date.toISOString().split('T')[0],
                    time: event.time,
                    location: event.location,
                    image: event.image || undefined,
                    status: event.status,
                    category: event.category,
                    attendees: event.attendees,
                    maxAttendees: event.maxAttendees,
                    type: event.type,
                }));

                setEvents(transformedEvents);
                setTotalEvents(response.pagination.total);
                setTotalPages(response.pagination.totalPages);
                setIsPageLoading(false);
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setEvents([]);
                setTotalEvents(0);
                setTotalPages(1);
                setIsPageLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchEvents();
    }, [user?.id, eventType, activeFilter, currentPage, refreshKey]);

    // Reset to page 1 when filter, search, or event type changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, eventType]);

    // Filter events by search query (status and type are filtered on backend)
    const filteredEvents = useMemo(() => {
        if (!searchQuery.trim()) {
            return events;
        }

        const query = searchQuery.toLowerCase();
        return events.filter(
            (event) =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.category.toLowerCase().includes(query)
        );
    }, [events, searchQuery]);

    // Use events directly since pagination is handled by backend
    const paginatedEvents = useMemo(() => {
        return filteredEvents;
    }, [filteredEvents]);

    // Count events by type (for badges) - fetch counts separately
    const [joinedCount, setJoinedCount] = useState(0);
    const [organizedCount, setOrganizedCount] = useState(0);
    const [rejectedOrganizations, setRejectedOrganizations] = useState<Organization[]>([]);
    const [hasRejectedOrgs, setHasRejectedOrgs] = useState(false);
    const [pendingOrganizations, setPendingOrganizations] = useState<Organization[]>([]);
    const [hasPendingOrgs, setHasPendingOrgs] = useState(false);
    const [dismissedRejectedIds, setDismissedRejectedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (!user?.id) return;

        const fetchCounts = async () => {
            try {
                const userId = parseInt(user.id);
                if (!userId || isNaN(userId)) return;

                // Fetch both counts with page=1, limit=1 to only get pagination info
                const [joinedResponse, organizedResponse] = await Promise.all([
                    getUserEvents(userId, "joined", undefined, 1, 1),
                    getUserEvents(userId, "organized", undefined, 1, 1),
                ]);

                setJoinedCount(joinedResponse.pagination.total);
                setOrganizedCount(organizedResponse.pagination.total);
            } catch (error) {
                console.error("Failed to fetch event counts:", error);
                setJoinedCount(0);
                setOrganizedCount(0);
            }
        };

        void fetchCounts();
    }, [user?.id, refreshKey]);

    // Fetch user organizations to check for rejected ones
    useEffect(() => {
        if (!user?.id) return;

        const fetchOrganizations = async () => {
            try {
                const userId = parseInt(user.id);
                if (!userId || isNaN(userId)) return;

                const response = await getUserOrganizations(userId);
                const rejected = response.data.filter(org => org.status === 'rejected');
                const pending = response.data.filter(org => org.status === 'pending');
                
                // Filter out dismissed rejected orgs
                const visibleRejected = rejected.filter(org => !dismissedRejectedIds.has(org.id));
                
                setRejectedOrganizations(visibleRejected);
                setHasRejectedOrgs(visibleRejected.length > 0);
                setPendingOrganizations(pending);
                setHasPendingOrgs(pending.length > 0);
            } catch (error) {
                console.error("Failed to fetch organizations:", error);
                setRejectedOrganizations([]);
                setHasRejectedOrgs(false);
                setPendingOrganizations([]);
                setHasPendingOrgs(false);
            }
        };

        void fetchOrganizations();
    }, [user?.id, refreshKey, dismissedRejectedIds]);

    // Event type change with async loading
    const changeEventType = useCallback(async (type: EventType) => {
        if (type === eventType) return;
        
        setIsPageLoading(true);
        setEventType(type);
        setCurrentPage(1);
        
        // Update URL to reflect the new tab
        router.replace(`/my-events?tab=${type}`, { scroll: false });
        
        // Loading will be handled by the fetch effect
    }, [eventType, router]);

    // Filter change with async loading
    const changeFilter = useCallback(async (filter: EventFilter) => {
        if (filter === activeFilter) return;
        
        setIsPageLoading(true);
        setActiveFilter(filter);
        setCurrentPage(1);
        // Loading will be handled by the fetch effect
    }, [activeFilter]);

    // Page navigation with async loading simulation
    const goToPage = useCallback(async (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        
        setIsPageLoading(true);
        setCurrentPage(page);
        // Loading will be handled by the fetch effect
    }, [totalPages, currentPage]);

    const goToNextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const goToPrevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const dismissRejectedOrg = useCallback((orgId: number) => {
        const newDismissed = new Set(dismissedRejectedIds);
        newDismissed.add(orgId);
        setDismissedRejectedIds(newDismissed);
        
        // Persist to localStorage
        if (user?.id) {
            const dismissedKey = `dismissed_rejected_orgs_${user.id}`;
            localStorage.setItem(dismissedKey, JSON.stringify(Array.from(newDismissed)));
        }
    }, [dismissedRejectedIds, user?.id]);

    const dismissAllRejectedOrgs = useCallback(() => {
        const allRejectedIds = rejectedOrganizations.map(org => org.id);
        const newDismissed = new Set([...dismissedRejectedIds, ...allRejectedIds]);
        setDismissedRejectedIds(newDismissed);
        
        // Persist to localStorage
        if (user?.id) {
            const dismissedKey = `dismissed_rejected_orgs_${user.id}`;
            localStorage.setItem(dismissedKey, JSON.stringify(Array.from(newDismissed)));
        }
    }, [rejectedOrganizations, dismissedRejectedIds, user?.id]);

    return {
        user,
        events,
        filteredEvents,
        paginatedEvents,
        isLoading,
        isPageLoading,
        eventType,
        changeEventType,
        activeFilter,
        changeFilter,
        searchQuery,
        setSearchQuery,
        // Counts for badges
        joinedCount,
        organizedCount,
        // Organizations
        rejectedOrganizations,
        hasRejectedOrgs,
        pendingOrganizations,
        hasPendingOrgs,
        dismissRejectedOrg,
        dismissAllRejectedOrgs,
        // Modal control
        shouldOpenOrganizeModal,
        clearOpenOrganizeModal: () => setShouldOpenOrganizeModal(false),
        // Pagination
        currentPage,
        totalPages: totalPages || 1,
        itemsPerPage: ITEMS_PER_PAGE,
        totalEvents,
        goToPage,
        goToNextPage,
        goToPrevPage,
    };
}
