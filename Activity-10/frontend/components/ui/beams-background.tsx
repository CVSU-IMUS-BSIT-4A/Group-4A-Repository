"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
    hueRange?: { min: number; max: number };
    hideContent?: boolean; 
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
};

function createBeam(width: number, height: number, hueMin: number, hueMax: number, isDarkMode: boolean): Beam {
    const angle = -35 + Math.random() * 10;
    const hueRange = hueMax - hueMin;
    // Increase opacity for light mode
    const baseOpacity = isDarkMode ? 0.12 : 0.25;
    const opacityRange = isDarkMode ? 0.16 : 0.25;
    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60,
        length: height * 2.5,
        angle: angle,
        speed: 0.6 + Math.random() * 1.2,
        opacity: baseOpacity + Math.random() * opacityRange,
        hue: hueMin + Math.random() * hueRange,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
    };
}

export function BeamsBackground({
    className,
    intensity = "strong",
    hueRange, // If not provided, will use full spectrum (0-360) for random colors
    hideContent = false,
    children,
}: AnimatedGradientBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);
    const isVisibleRef = useRef(true);
    const MINIMUM_BEAMS = 12;
    const { theme } = useTheme(); 

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const isDarkMode = () => {
            return document.documentElement.classList.contains("dark");
        };

        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const totalBeams = MINIMUM_BEAMS * 1.5;
            const effectiveHueRange = hueRange || { min: 0, max: 360 };
            beamsRef.current = Array.from({ length: totalBeams }, () =>
                createBeam(canvas.width, canvas.height, effectiveHueRange.min, effectiveHueRange.max, isDarkMode())
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam: Beam, index: number) {
            if (!canvas) return beam;
            
            const column = index % 3;
            const spacing = canvas.width / 3;
            const effectiveHueRange = hueRange || { min: 0, max: 360 };
            const hueRangeSize = effectiveHueRange.max - effectiveHueRange.min;
            const darkMode = isDarkMode();
            const baseOpacity = darkMode ? 0.2 : 0.35;
            const opacityRange = darkMode ? 0.1 : 0.2;

            beam.y = canvas.height + 100;
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.5;
            beam.width = 100 + Math.random() * 100;
            beam.speed = 0.5 + Math.random() * 0.4;
            beam.hue = effectiveHueRange.min + Math.random() * hueRangeSize;
            beam.opacity = baseOpacity + Math.random() * opacityRange;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            const darkMode = isDarkMode();
            // Calculate pulsing opacity with higher multiplier for light mode
            const opacityMultiplier = darkMode ? 1 : 1.5;
            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                opacityMap[intensity] *
                opacityMultiplier;

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
            
            // Adjust lightness for better visibility in light mode
            const lightness = darkMode ? 65 : 50; // Darker colors in light mode for better contrast

            // Enhanced gradient with multiple color stops
            gradient.addColorStop(0, `hsla(${beam.hue}, 85%, ${lightness}%, 0)`);
            gradient.addColorStop(
                0.1,
                `hsla(${beam.hue}, 85%, ${lightness}%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(
                0.4,
                `hsla(${beam.hue}, 85%, ${lightness}%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.6,
                `hsla(${beam.hue}, 85%, ${lightness}%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.9,
                `hsla(${beam.hue}, 85%, ${lightness}%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(1, `hsla(${beam.hue}, 85%, ${lightness}%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate() {
            if (!canvas || !ctx || !isVisibleRef.current) {
                animationFrameRef.current = 0;
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Slightly less blur in light mode for better visibility
            const blurAmount = isDarkMode() ? "35px" : "30px";
            ctx.filter = `blur(${blurAmount})`;

            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                // Reset beam when it goes off screen
                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index);
                }

                drawBeam(ctx, beam);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        // Intersection Observer to pause animation when not visible
        const containerElement = containerRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isVisibleRef.current = entry.isIntersecting;
                    if (entry.isIntersecting && !animationFrameRef.current) {
                        animate();
                    } else if (!entry.isIntersecting && animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                        animationFrameRef.current = 0;
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (containerElement) {
            observer.observe(containerElement);
        }

        animate();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (containerElement) {
                observer.unobserve(containerElement);
            }
        };
    }, [intensity, hueRange]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute inset-0 w-full h-full overflow-hidden bg-neutral-50 dark:bg-neutral-950",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ filter: "blur(15px)" }}
            />

            <motion.div
                className="absolute inset-0 bg-neutral-950/5"
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                }}
                style={{
                    backdropFilter: "blur(50px)",
                }}
            />

            {!hideContent && (
            <div className="relative z-10 flex h-screen w-full items-center justify-center">
                    {children ? (
                        children
                    ) : (
                <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
                            <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <Image
                                        src={theme === "dark" ? "/whitelogo.png" : "/blacklogo.png"}
                                        alt="Occasio"
                                        width={250}
                                        height={75}
                                        className="h-12 md:h-16 lg:h-20 w-auto"
                                        priority
                                    />
                                </motion.div>
                                <motion.span
                                    className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-neutral-900 dark:text-white tracking-tight whitespace-nowrap"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ 
                                        duration: 0.8, 
                                        delay: 0.5,
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 15
                                    }}
                                >
                                    Occasio
                                </motion.span>
                            </div>
                            <motion.h5
                                className="text-5xl md:text-6xl lg:text-7xl font-semibold text-neutral-900 dark:text-white tracking-tighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                                Every Occasion, Perfectly <motion.span 
                                    className="relative inline-block px-2 py-1 cursor-pointer"
                                    whileHover={{ 
                                        rotate: -3,
                                        scale: 1.05,
                                        transition: { 
                                            duration: 0.3,
                                            ease: "easeInOut"
                                        }
                                    }}
                                >
                                    <motion.span 
                                        className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-pink-500/30 rounded-md -rotate-1"
                                        whileHover={{
                                            rotate: -4,
                                            transition: {
                                                duration: 0.3,
                                                ease: "easeInOut"
                                            }
                                        }}
                                    ></motion.span>
                                    <span className="relative">Planned</span>
                                </motion.span>.
                            </motion.h5>

                        </div>
                    )}
                </div>
            )}
            {children && hideContent && (
                <div className="relative z-10">
                    {children}
            </div>
            )}
        </div>
    );
}
