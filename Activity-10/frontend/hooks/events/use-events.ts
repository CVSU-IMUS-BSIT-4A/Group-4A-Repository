"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllEvents } from "@/lib/api";

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
}

export type EventFilter = "all" | "upcoming" | "ongoing" | "completed";

// Items per page - 10 cards per page
const ITEMS_PER_PAGE = 10;

export function useEvents() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const hasInitializedRef = useRef(false);

    // Create stable string representation of search params to avoid infinite loops
    const searchParamsString = useMemo(
        () => `${searchParams.get("filter") || ""}-${searchParams.get("refresh") || ""}`,
        [searchParams]
    );

    // Handle URL params for filter, refresh - only read on mount/URL change
    useEffect(() => {
        const filter = searchParams.get("filter");
        const refresh = searchParams.get("refresh");

        // Only update filter if URL param exists and is different from current state
        if (filter === "all" || filter === "upcoming" || filter === "ongoing" || filter === "completed") {
            setActiveFilter((current) => {
                if (filter !== current) {
                    hasInitializedRef.current = true;
                    return filter;
                }
                return current;
            });
        } else if (!filter && !hasInitializedRef.current) {
            // Only set default on initial load if no filter param
            setActiveFilter("all");
            hasInitializedRef.current = true;
        }

        if (refresh) {
            setRefreshKey(Date.now());
        }
    }, [searchParamsString, searchParams]); // Use stable string + searchParams for getters

    // Fetch events when activeFilter or currentPage changes
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(currentPage === 1);
            setIsPageLoading(currentPage > 1);
            try {
                // Convert filter to status for API call (excluding "all")
                const status = activeFilter !== "all" ? activeFilter : undefined;
                const response = await getAllEvents(
                    currentPage,
                    ITEMS_PER_PAGE,
                    status
                );

                // Transform backend events to frontend format
                const transformedEvents: Event[] = response.events.map((event) => {
                    return {
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        date: event.date, 
                        time: event.time,
                        location: event.location,
                        image: event.image || undefined,
                        status: event.status as Event["status"],
                        category: event.category,
                        attendees: event.attendees,
                        maxAttendees: event.maxAttendees,
                    };
                });

                // Filter out completed and cancelled events (always exclude from display)
                const filteredTransformedEvents = transformedEvents.filter(
                    (event) => event.status !== "completed" && event.status !== "cancelled"
                );
                
                setEvents(filteredTransformedEvents);
                // Adjust counts if we filtered out some events
                const excludedCount = transformedEvents.length - filteredTransformedEvents.length;
                if (activeFilter === "all" && excludedCount > 0) {
                    // If showing "all", adjust total to exclude completed/cancelled
                    setTotalEvents(Math.max(0, response.pagination.total - excludedCount));
                    setTotalPages(Math.ceil(Math.max(0, response.pagination.total - excludedCount) / ITEMS_PER_PAGE));
                } else {
                    // For specific filters, backend already filtered correctly
                    setTotalEvents(response.pagination.total);
                    setTotalPages(response.pagination.totalPages);
                }
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
    }, [currentPage, refreshKey, activeFilter]); // Add activeFilter to trigger fetch on filter change

    // Events are already filtered by backend, so just use them directly
    const filteredEvents = useMemo(() => {
        return events; // Backend already filters by status if activeFilter is not "all"
    }, [events]);

    // Search filter
    const searchedEvents = useMemo(() => {
        if (!searchQuery.trim()) {
            return filteredEvents;
        }

        const query = searchQuery.toLowerCase();
        return filteredEvents.filter(
            (event) =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.category.toLowerCase().includes(query)
        );
    }, [filteredEvents, searchQuery]);

    // Use events directly since pagination is handled by backend
    const paginatedEvents = useMemo(() => {
        return searchedEvents;
    }, [searchedEvents]);

    // Filter change - triggers async fetch from backend
    const changeFilter = useCallback(async (filter: EventFilter) => {
        if (filter === activeFilter) return;
        
        setIsPageLoading(true);
        setActiveFilter(filter);
        setCurrentPage(1); // Reset to page 1 when filter changes
        
        // Update URL to reflect the new filter
        const newUrl = filter === "all" ? "/events" : `/events?filter=${filter}`;
        router.push(newUrl, { scroll: false });
        // Loading will be handled by the fetch effect
    }, [activeFilter, router]);

    // Page navigation with async loading simulation
    const goToPage = useCallback(async (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        
        setIsPageLoading(true);
        setCurrentPage(page);
        // Loading will be handled by the fetch effect
    }, [totalPages, currentPage]);

    const goToNextPage = useCallback(async () => {
        await goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const goToPrevPage = useCallback(async () => {
        await goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    return {
        events,
        filteredEvents: searchedEvents,
        paginatedEvents,
        isLoading,
        isPageLoading,
        activeFilter,
        changeFilter,
        searchQuery,
        setSearchQuery,
        currentPage,
        totalPages,
        totalEvents,
        goToPage,
        goToNextPage,
        goToPrevPage,
    };
}

