"use client";

import {
    HeroSection,
    AboutSection,
    EventsSection,
    OrganizeSection,
} from "@/components/landing";
import { useLanding } from "@/hooks/landing";

export default function LandingPage() {
    const { showLogo, scrollToSection, handleGetStarted } = useLanding();

    return (
        <div className="relative">
            <HeroSection onScrollToAbout={() => scrollToSection("about")} />
            <AboutSection showLogo={showLogo} />
            <EventsSection />
            <OrganizeSection onGetStarted={handleGetStarted} />
        </div>
    );
}
