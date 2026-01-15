"use client";

import { useEvents } from "@/hooks/events/use-events";
import { Navbar } from "@/components/ui/navbar";
import { BeamsBackground } from "@/components/ui/beams-background";
import {
    EventsHeader,
    EventsFilters,
    EventsGrid,
    EventsEmpty,
    EventsPagination,
} from "@/components/events";

export default function EventsPage() {
    const {
        events,
        filteredEvents,
        paginatedEvents,
        isLoading,
        isPageLoading,
        activeFilter,
        changeFilter,
        searchQuery,
        setSearchQuery,
        currentPage,
        totalPages,
        goToPage,
        goToNextPage,
        goToPrevPage,
    } = useEvents();

    return (
        <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden relative">
            <BeamsBackground 
                intensity="subtle" 
                className="fixed! z-0!"
                hideContent={true}
            />

            {/* Full page loader for async pagination */}
            {isPageLoading && (
                <div className="fixed inset-0 bg-neutral-50/60 dark:bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-neutral-300 dark:border-neutral-600 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Loading...</span>
                    </div>
                </div>
            )}

            <Navbar showCenterNav={false} />

            <main className="flex-1 flex flex-col pt-20 pb-4 px-4 sm:px-6 lg:px-8 md:overflow-hidden relative z-10">
                <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
                    <EventsHeader 
                        eventsCount={filteredEvents.length}
                        isLoading={isPageLoading}
                    />

                    <EventsFilters
                        activeFilter={activeFilter}
                        onFilterChange={changeFilter}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        isLoading={isPageLoading}
                    />

                    <div className="flex-1 flex flex-col">
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center min-h-[200px]">
                                <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-600 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
                            </div>
                        ) : filteredEvents.length > 0 ? (
                            <>
                                <div className="flex-1">
                                    <EventsGrid events={paginatedEvents} />
                                </div>
                                {totalPages > 1 && (
                                    <EventsPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={goToPage}
                                        onPrevPage={goToPrevPage}
                                        onNextPage={goToNextPage}
                                        isLoading={isPageLoading}
                                    />
                                )}
                            </>
                        ) : (
                            <EventsEmpty
                                hasEvents={events.length > 0}
                                searchQuery={searchQuery}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

