"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon, User, Settings, LogOut, Ticket, LayoutDashboard, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    role: 'user' | 'admin';
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export function Navbar({ className, showCenterNav = true }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const [user, setUser] = useState<UserData | null>(null);
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/");
    };

    useEffect(() => {
        // Check if user is signed in
        const checkUser = () => {
            try {
                const userData = localStorage.getItem("user");
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error("Error reading user data:", error);
            }
        };

        checkUser();
        // Listen for storage changes (e.g., when user signs in/out in another tab)
        window.addEventListener("storage", checkUser);
        
        // Also check on mount and periodically
        const interval = setInterval(checkUser, 1000);

        return () => {
            window.removeEventListener("storage", checkUser);
            clearInterval(interval);
        };
    }, []);

    const getUserInitials = () => {
        if (!user) return "U";
        const first = user.firstName?.[0]?.toUpperCase() || "";
        const last = user.lastName?.[0]?.toUpperCase() || "";
        return first + last || "U";
    };

    useEffect(() => {
        const handleScroll = () => {
            // Check if scrolled past hero section (100vh)
            const scrollPosition = window.scrollY;
            const heroHeight = window.innerHeight;
            setIsScrolled(scrollPosition > heroHeight * 0.8);

            // Determine active section based on scroll position
            const sections = ["hero", "about", "events", "organize"];
            const sectionElements = sections.map(id => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return { id, top: rect.top, bottom: rect.bottom, height: rect.height };
                }
                return null;
            }).filter(Boolean) as Array<{ id: string; top: number; bottom: number; height: number }>;

            // Find the section that's most visible in the viewport
            let active = "hero";
            let maxVisibleArea = 0;

            for (const section of sectionElements) {
                // Calculate visible area of the section in viewport
                const visibleTop = Math.max(0, section.top);
                const visibleBottom = Math.min(window.innerHeight, section.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                
                // Calculate the percentage of the section that's visible
                const visibleArea = visibleHeight / section.height;
                
                // Prioritize sections that are at the top of viewport (within 100px)
                // This works better with snap scrolling
                const isNearTop = section.top >= -100 && section.top <= 200;
                
                // If section is near top and has significant visibility, it's likely the active one
                if (isNearTop && visibleArea > 0.3 && visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea;
                    active = section.id;
                }
            }

            // Fallback: if no section meets criteria, find the one closest to the top
            if (active === "hero" && sectionElements.length > 0) {
                const sortedSections = sectionElements
                    .filter(s => s.top >= -100 && s.top <= window.innerHeight)
                    .sort((a, b) => {
                        // Prefer sections that are in the viewport
                        if (a.top >= 0 && a.top < window.innerHeight && b.top < 0) return -1;
                        if (b.top >= 0 && b.top < window.innerHeight && a.top < 0) return 1;
                        return Math.abs(a.top) - Math.abs(b.top);
                    });
                
                if (sortedSections.length > 0) {
                    active = sortedSections[0].id;
                }
            }

            setActiveSection(active);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    const navItems = [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Events", href: "#events" },
        { label: "Organize", href: "#organize" },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const sectionId = href.replace("#", "");
        const section = document.getElementById(sectionId);
        section?.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // If already on landing page, scroll to hero section
        if (window.location.pathname === "/") {
            const heroSection = document.getElementById("hero");
            heroSection?.scrollIntoView({ behavior: "smooth" });
        } else {
            // Navigate to landing page
            window.location.href = "/";
        }
    };

    return (
        <>
            {/* Mobile Sticky Header (when showCenterNav is false) */}
            {!showCenterNav && (
                <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Logo */}
                        <Link href="/" onClick={handleLogoClick} className="block">
                            <Image
                                src={theme === "dark" ? "/whitelogo.png" : "/blacklogo.png"}
                                alt="Occasio"
                                width={100}
                                height={30}
                                className="h-7 w-auto"
                                priority
                            />
                        </Link>

                        {/* Avatar and Theme Toggle */}
                        <div className="flex items-center gap-2">
                            {user && (
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className="outline-none focus:outline-none"
                                            title={`${user.firstName} ${user.lastName}`}
                                        >
                                            <Avatar className="w-9 h-9 border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity">
                                                <AvatarFallback className="text-xs font-semibold">
                                                    {getUserInitials()}
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
                                                <p className="text-xs leading-none text-muted-foreground/70 mt-0.5">
                                                    User ID: {user.id}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {user.role === 'admin' ? (
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

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logo - Top Left (Desktop Only) */}
            <motion.div
                className="hidden md:block fixed top-4 md:top-6 left-4 md:left-6 z-50"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
                <Link href="/" onClick={handleLogoClick} className="block">
                    <Image
                        src={theme === "dark" ? "/whitelogo.png" : "/blacklogo.png"}
                        alt="Occasio"
                        width={120}
                        height={36}
                        className="h-8 md:h-10 w-auto"
                        priority
                    />
                </Link>
            </motion.div>

            {/* Theme Toggle and Avatar - Top Right (Desktop Only) */}
            <div className="hidden md:flex fixed top-4 md:top-6 right-4 md:right-6 z-50 items-center gap-2 md:gap-3">
                {/* Avatar (only if user is signed in) */}
                {user && (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="outline-none focus:outline-none"
                                title={`${user.firstName} ${user.lastName}`}
                            >
                                <Avatar className="w-10 h-10 border-2 border-neutral-300 dark:border-neutral-600 cursor-pointer hover:opacity-80 transition-opacity">
                                    <AvatarFallback className="text-sm font-semibold">
                                        {getUserInitials()}
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
                            {user.role === 'admin' ? (
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
                                <Link href="/tickets" className="cursor-pointer">
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

                {/* Theme Toggle Button */}
                <motion.button
                    onClick={toggleTheme}
                    className={cn(
                        "p-2.5 md:p-3 rounded-full text-neutral-900 dark:text-white transition-all duration-300",
                        isScrolled
                            ? "bg-neutral-200/50 dark:bg-white/10 backdrop-blur-md border border-neutral-300 dark:border-white/20 shadow-lg"
                            : "bg-transparent backdrop-blur-none border border-transparent shadow-none"
                    )}
                    initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle theme"
                >
                    <AnimatePresence mode="wait">
                        {theme === "dark" ? (
                            <motion.div
                                key="sun"
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <Sun className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="moon"
                                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <Moon className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {showCenterNav && (
                <motion.nav
                    className={cn(
                        "fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-2 xs:mt-3 sm:mt-4 md:mt-6 w-full max-w-7xl px-2 xs:px-3 sm:px-4",
                        className
                    )}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Desktop Navbar */}
                    <div className="hidden md:flex items-center justify-center">
                    <div className={cn(
                        "relative flex items-center gap-0.5 xs:gap-1 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full border transition-all duration-300",
                        isScrolled 
                            ? "bg-neutral-200/50 dark:bg-white/10 backdrop-blur-md border-neutral-300 dark:border-white/20 shadow-lg" 
                            : "bg-transparent backdrop-blur-none border-transparent shadow-none"
                    )}>
                        {navItems.map((item, index) => {
                            const sectionId = item.href.replace("#", "");
                            const isActive = activeSection === sectionId && sectionId !== "hero";
                            
                            return (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className={cn(
                                        "relative z-10 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-semibold rounded-full transition-colors",
                                        isActive
                                            ? "text-white"
                                            : "text-neutral-700 dark:text-white/70 hover:text-white"
                                    )}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0
                                    }}
                                    transition={{ 
                                        duration: 0.3,
                                        delay: index * 0.1
                                    }}
                                    whileHover={{ 
                                        scale: 1.05,
                                        backgroundColor: isActive 
                                            ? undefined
                                            : (theme === "dark" ? "rgba(115, 115, 115, 0.8)" : "rgba(82, 82, 82, 0.8)")
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-neutral-700 dark:bg-neutral-600 shadow-md -z-10"
                                            layoutId="activeNavBackground"
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                                mass: 0.5
                                            }}
                                        />
                                    )}
                                    {item.label}
                                </motion.a>
                            );
                        })}
                        {!user && (
                            <>
                                <div className="h-5 xs:h-6 w-px bg-neutral-300 dark:bg-white/20 mx-1.5 xs:mx-2" />
                                <motion.a
                                    href="/signin"
                                    className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-semibold text-white bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 transition-all rounded-full shadow-md hover:shadow-lg"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: navItems.length * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sign In
                                </motion.a>
                            </>
                        )}
                    </div>
                </div>

            {/* Mobile Navbar */}
            <div className="md:hidden flex items-center justify-between w-full relative z-40 gap-2">
                <motion.button
                    onClick={toggleMobileMenu}
                    className={cn(
                        "p-1.5 xs:p-2 rounded-full text-neutral-900 dark:text-white relative z-40 transition-all duration-300",
                        isScrolled
                            ? "bg-neutral-200/50 dark:bg-white/10 backdrop-blur-md border border-neutral-300 dark:border-white/20 shadow-lg"
                            : "bg-transparent backdrop-blur-none border border-transparent shadow-none"
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isMobileMenuOpen ? (
                        <X className="w-4 h-4 xs:w-5 xs:h-5" />
                    ) : (
                        <Menu className="w-4 h-4 xs:w-5 xs:h-5" />
                    )}
                </motion.button>

                <div className="flex items-center gap-2 flex-1 justify-end">
                    {/* Avatar (only if user is signed in) - Mobile */}
                    {user && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="outline-none focus:outline-none relative z-40"
                                    title={`${user.firstName} ${user.lastName}`}
                                >
                                    <Avatar className="w-10 h-10 border-2 border-neutral-300 dark:border-neutral-600 cursor-pointer hover:opacity-80 transition-opacity">
                                        <AvatarFallback className="text-sm font-semibold">
                                            {getUserInitials()}
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
                                {user.role === 'admin' ? (
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
                                    <Link href="/tickets" className="cursor-pointer">
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

                    {/* Theme Toggle Button - Mobile (Before Get Started) */}
                    <motion.button
                        onClick={toggleTheme}
                        className={cn(
                            "p-1.5 xs:p-2 rounded-full text-neutral-900 dark:text-white relative z-40 transition-all duration-300",
                            isScrolled
                                ? "bg-neutral-200/50 dark:bg-white/10 backdrop-blur-md border border-neutral-300 dark:border-white/20 shadow-lg"
                                : "bg-transparent backdrop-blur-none border border-transparent shadow-none"
                        )}
                        initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle theme"
                    >
                        <AnimatePresence mode="wait">
                            {theme === "dark" ? (
                                <motion.div
                                    key="sun"
                                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Sun className="w-4 h-4 xs:w-5 xs:h-5" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Moon className="w-4 h-4 xs:w-5 xs:h-5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {!user && (
                        <motion.a
                            href="/signin"
                            className="px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-semibold text-white bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 transition-all rounded-full shadow-md hover:shadow-lg relative z-40"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.a>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed top-20 left-4 right-4 z-50 md:hidden"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="bg-neutral-200/50 dark:bg-white/10 backdrop-blur-md rounded-2xl border border-neutral-300 dark:border-white/20 shadow-xl p-4">
                            <div className="flex flex-col gap-1">
                                {navItems.map((item, index) => {
                                    const sectionId = item.href.replace("#", "");
                                    const isActive = activeSection === sectionId && sectionId !== "hero";
                                    return (
                                        <motion.a
                                            key={item.label}
                                            href={item.href}
                                            onClick={(e) => handleNavClick(e, item.href)}
                                            className={cn(
                                                "px-4 py-3 text-base font-semibold rounded-lg",
                                                isActive
                                                    ? "text-white shadow-md"
                                                    : "text-neutral-700 dark:text-white/70 hover:text-white"
                                            )}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ 
                                                opacity: 1, 
                                                x: 0,
                                                scale: isActive ? 1.02 : 1,
                                                backgroundColor: isActive 
                                                    ? (theme === "dark" ? "rgb(82 82 82)" : "rgb(64 64 64)")
                                                    : "transparent"
                                            }}
                                            transition={{ 
                                                duration: 0.3,
                                                delay: index * 0.1,
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20
                                            }}
                                            whileHover={{
                                                scale: isActive ? 1.02 : 1.02,
                                                backgroundColor: isActive 
                                                    ? (theme === "dark" ? "rgb(82 82 82)" : "rgb(64 64 64)")
                                                    : (theme === "dark" ? "rgba(115, 115, 115, 0.8)" : "rgba(82, 82, 82, 0.8)")
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {item.label}
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
                </motion.nav>
            )}
        </>
    );
}

