"use client";

import { useMyTickets } from "@/hooks/my-tickets";
import { Navbar } from "@/components/ui/navbar";
import { BeamsBackground } from "@/components/ui/beams-background";
import {
    MyTicketsHeader,
    MyTicketCard,
    MyTicketsEmpty,
    MyTicketsLoading,
} from "@/components/my-tickets";

export default function MyTicketsPage() {
    const { user, tickets, isLoading, error, formatDate, formatTime } =
        useMyTickets();

    const userName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
        : "Guest";

    return (
        <div className="min-h-screen flex flex-col relative">
            <BeamsBackground
                intensity="subtle"
                className="fixed! z-0!"
                hideContent={true}
            />

            <Navbar showCenterNav={false} />

            <main className="flex-1 flex flex-col pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl mx-auto w-full">
                    <MyTicketsHeader />

                    {isLoading ? (
                        <MyTicketsLoading />
                    ) : error ? (
                        <div className="text-center py-16">
                            <p className="text-red-500 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <MyTicketsEmpty />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tickets.map((ticket, index) => (
                                <MyTicketCard
                                    key={ticket.ticketCode}
                                    ticket={ticket}
                                    index={index}
                                    formatDate={formatDate}
                                    formatTime={formatTime}
                                    userName={userName}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

