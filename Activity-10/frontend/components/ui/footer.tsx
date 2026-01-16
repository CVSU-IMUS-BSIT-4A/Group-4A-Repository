"use client";

import { motion } from "motion/react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
    ];

    const quickLinks = [
        { label: "Overview", href: "#overview" },
        { label: "Features", href: "#features" },
        { label: "Check-in", href: "#checkin" },
        { label: "Organizers", href: "#organizers" },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const sectionId = href.replace("#", "");
        const section = document.getElementById(sectionId);
        section?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className="relative w-full border-t border-neutral-300 dark:border-white/10 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-4 py-8 xs:py-10 sm:py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 mb-6 xs:mb-7 sm:mb-8">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-3 xs:mb-4">
                            <span className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600" />
                            <span className="text-lg xs:text-xl font-semibold text-neutral-900 dark:text-white">
                                VenueFlow
                            </span>
                        </div>
                        <p className="text-sm xs:text-base text-neutral-700 dark:text-white/70 mb-3 xs:mb-4">
                            Registration, tickets, and QR entry in one workflow.
                        </p>
                        <div className="flex gap-2 xs:gap-3 sm:gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="p-1.5 xs:p-2 bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 rounded-full text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4 xs:w-5 xs:h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 className="text-base xs:text-lg font-semibold text-neutral-900 dark:text-white mb-3 xs:mb-4">Quick Links</h4>
                        <ul className="space-y-1.5 xs:space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="text-sm xs:text-base text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="text-base xs:text-lg font-semibold text-neutral-900 dark:text-white mb-3 xs:mb-4">Contact</h4>
                        <ul className="space-y-2 xs:space-y-3">
                            <li className="flex items-start gap-2 xs:gap-3 text-sm xs:text-base text-neutral-700 dark:text-white/70">
                                <Mail className="w-4 h-4 xs:w-5 xs:h-5 mt-0.5 shrink-0" />
                                <span className="break-words">support@venueflow.app</span>
                            </li>
                            <li className="flex items-start gap-2 xs:gap-3 text-sm xs:text-base text-neutral-700 dark:text-white/70">
                                <Phone className="w-4 h-4 xs:w-5 xs:h-5 mt-0.5 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-2 xs:gap-3 text-sm xs:text-base text-neutral-700 dark:text-white/70">
                                <MapPin className="w-4 h-4 xs:w-5 xs:h-5 mt-0.5 shrink-0" />
                                <span className="break-words">123 Event Street, City, State 12345</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Copyright */}
                <motion.div
                    className="pt-6 xs:pt-7 sm:pt-8 border-t border-neutral-300 dark:border-white/10 text-right"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p className="text-neutral-600 dark:text-white/50 text-xs xs:text-sm">
                        © {currentYear} VenueFlow. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}

