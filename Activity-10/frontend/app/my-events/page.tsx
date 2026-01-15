"use client";

import { useState, useCallback, useEffect } from "react";
import { useMyEvents } from "@/hooks/my-events";
import { Navbar } from "@/components/ui/navbar";
import { BeamsBackground } from "@/components/ui/beams-background";
import {
    MyEventsHeader,
    MyEventsFilters,
    MyEventsGrid,
    MyEventsEmpty,
    MyEventsPagination,
} from "@/components/my-events";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OrganizeTypeCards, IndividualFormDialog, OrganizationFormDialog } from "@/components/organize";

export default function MyEventsPage() {
    const {
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
        joinedCount,
        organizedCount,
        currentPage,
        totalPages,
        goToPage,
        goToNextPage,
        goToPrevPage,
        shouldOpenOrganizeModal,
        clearOpenOrganizeModal,
        hasRejectedOrgs,
        rejectedOrganizations,
        pendingOrganizations,
        dismissAllRejectedOrgs,
    } = useMyEvents();
    
    const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    const [isIndividualFormOpen, setIsIndividualFormOpen] = useState(false);
    const [isOrganizationFormOpen, setIsOrganizationFormOpen] = useState(false);
    
    const handleOpenOrganizeModal = useCallback(() => {
        setIsOrganizeModalOpen(true);
    }, []);
    
    // Open modal when shouldOpenOrganizeModal is true
    useEffect(() => {
        if (shouldOpenOrganizeModal) {
            // Use setTimeout to avoid synchronous state update warning
            const timeoutId = setTimeout(() => {
                setIsOrganizeModalOpen(true);
                clearOpenOrganizeModal();
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [shouldOpenOrganizeModal, clearOpenOrganizeModal]);

    if (!user) {
        return null;
    }

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
                    <MyEventsHeader 
                        eventsCount={filteredEvents.length}
                        eventType={eventType}
                        onEventTypeChange={changeEventType}
                        isLoading={isPageLoading}
                        joinedCount={joinedCount}
                        organizedCount={organizedCount}
                        shouldOpenOrganizeModal={shouldOpenOrganizeModal}
                        onOrganizeModalOpenChange={clearOpenOrganizeModal}
                        isOrganizeModalOpen={isOrganizeModalOpen}
                        onOrganizeModalOpenChangeInternal={setIsOrganizeModalOpen}
                        hasRejectedOrgs={hasRejectedOrgs}
                        hasPendingOrgs={pendingOrganizations.length > 0}
                    />

                    <MyEventsFilters
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
                                    <MyEventsGrid events={paginatedEvents} />
                                </div>
                                {totalPages > 1 && (
                                    <MyEventsPagination
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
                            <MyEventsEmpty
                                hasEvents={events.length > 0}
                                searchQuery={searchQuery}
                                eventType={eventType}
                                onOrganizeClick={handleOpenOrganizeModal}
                            />
                        )}
                    </div>
                </div>
            </main>
            
            {/* Organize Modal Dialog - Moved from header */}
            <Dialog open={isOrganizeModalOpen} onOpenChange={setIsOrganizeModalOpen}>
                <DialogContent
                    className="max-w-2xl w-full p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
                    onClose={() => setIsOrganizeModalOpen(false)}
                >
                    <div className="w-full">
                        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2 text-center">
                            How do you want to organize your event?
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 text-center">
                            Choose the option that best fits your needs
                        </p>
                        <OrganizeTypeCards
                            onTypeSelect={(type: "individual" | "organization") => {
                                if (type === "individual") {
                                    setIsOrganizeModalOpen(false);
                                    setIsIndividualFormOpen(true);
                                } else {
                                    setIsOrganizeModalOpen(false);
                                    setIsOrganizationFormOpen(true);
                                }
                            }}
                            rejectedOrganizations={rejectedOrganizations}
                            pendingOrganizations={pendingOrganizations}
                            onDismissRejected={dismissAllRejectedOrgs}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Individual Form Dialog */}
            <IndividualFormDialog
                open={isIndividualFormOpen}
                onOpenChange={setIsIndividualFormOpen}
            />

            {/* Organization Form Dialog */}
            <OrganizationFormDialog
                open={isOrganizationFormOpen}
                onOpenChange={setIsOrganizationFormOpen}
            />
        </div>
    );
}
