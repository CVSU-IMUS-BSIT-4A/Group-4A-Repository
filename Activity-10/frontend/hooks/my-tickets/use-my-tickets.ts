"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserTickets, UserTicket } from "@/lib/api";

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
}

export function useMyTickets() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [tickets, setTickets] = useState<UserTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        } catch {
            router.push("/signin");
            return;
        }
    }, [router]);

    useEffect(() => {
        const fetchTickets = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            setError(null);

            try {
                const userId = parseInt(user.id);
                if (!userId || isNaN(userId)) {
                    throw new Error("Invalid user ID");
                }

                const response = await getUserTickets(userId);
                // Filter out tickets from completed events (additional safety check)
                const activeTickets = response.data.filter(
                    (ticket) => ticket.status !== "completed"
                );
                setTickets(activeTickets);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load tickets"
                );
            } finally {
                setIsLoading(false);
            }
        };

        void fetchTickets();
    }, [user?.id]);

    const formatDate = (date: string | Date) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const h = parseInt(hours);
        if (isNaN(h)) return time;
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return {
        user,
        tickets,
        isLoading,
        error,
        formatDate,
        formatTime,
    };
}

