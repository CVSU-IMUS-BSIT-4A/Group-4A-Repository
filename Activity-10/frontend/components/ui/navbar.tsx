"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Sun,
    Ticket,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
    className?: string;
    showCenterNav?: boolean;
}

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

const LANDING_LINKS = [
    { label: "Overview", href: "#overview" },
    { label: "Features", href: "#features" },
    { label: "Check-in", href: "#checkin" },
    { label: "Organizers", href: "#organizers" },
];

export function Navbar({ className, showCenterNav = true }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/");
    };

    useEffect(() => {
        const checkUser = () => {
            try {
                const userData = localStorage.getItem("user");
                if (userData) {
                    setUser(JSON.parse(userData));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error reading user data:", error);
            }
        };

        checkUser();
        window.addEventListener("storage", checkUser);
        const interval = setInterval(checkUser, 2000);

        return () => {
            window.removeEventListener("storage", checkUser);
            clearInterval(interval);
        };
    }, []);

    const getUserInitials = useMemo(() => {
        if (!user) return "U";
        const first = user.firstName?.[0]?.toUpperCase() || "";
        const last = user.lastName?.[0]?.toUpperCase() || "";
        return first + last || "U";
    }, [user]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!href.startsWith("#")) return;
        e.preventDefault();
        const section = document.querySelector(href);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-50 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur",
                className,
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <span className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 shadow-lg shadow-emerald-500/30" />
                    <div className="leading-tight">
                        <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                            VenueFlow
                        </span>
                        <span className="block text-base font-semibold text-neutral-900 dark:text-white">
                            Check-in Suite
                        </span>
                    </div>
                </Link>

                {showCenterNav && (
                    <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
                        {LANDING_LINKS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="transition-colors hover:text-neutral-900 dark:hover:text-white"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                )}

                <div className="flex items-center gap-2">
                    {!user && (
                        <Link
                            href="/signin"
                            className="hidden sm:inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 transition hover:border-neutral-300 dark:hover:border-neutral-700"
                        >
                            Sign in
                        </Link>
                    )}
                    <Link
                        href="/events"
                        className="hidden sm:inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                        Explore
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="rounded-full border border-neutral-200 dark:border-neutral-800 p-2 text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    {user && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button className="outline-none">
                                    <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-700">
                                        <AvatarFallback className="text-xs font-semibold">
                                            {getUserInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.role === "admin" ? (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-events" className="cursor-pointer">
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                <span>My Events</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem asChild>
                                        <Link href="/my-events" className="cursor-pointer">
                                            <CalendarDays className="mr-2 h-4 w-4" />
                                            <span>My Events</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/my-tickets" className="cursor-pointer">
                                        <Ticket className="mr-2 h-4 w-4" />
                                        <span>My Tickets</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <button
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 p-2 text-neutral-600 md:hidden"
                        aria-label="Toggle navigation"
                    >
                        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && showCenterNav && (
                <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-neutral-950/95 md:hidden">
                    <div className="mx-auto flex flex-col gap-2 px-4 py-4 text-sm text-neutral-700 dark:text-neutral-200">
                        {LANDING_LINKS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

