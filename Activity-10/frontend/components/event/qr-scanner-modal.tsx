"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, QrCode, CheckCircle, XCircle, Loader2, Camera, CameraOff, Upload } from "lucide-react";
import jsQR from "jsqr";

interface AttendeeInfo {
    id: number;
    userId: number;
    status: string;
    registeredAt: string;
    user?: {
        email: string;
    };
}

interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: number;
    eventName: string;
    onVerifyAttendee: (ticketCode: string) => Promise<{ success: boolean; message: string; attendee?: AttendeeInfo }>;
}

export function QRScannerModal({
    isOpen,
    onClose,
    eventId,
    eventName,
    onVerifyAttendee,
}: QRScannerModalProps) {
    const [scannedCode, setScannedCode] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<{
        success: boolean;
        message: string;
        attendee?: AttendeeInfo;
    } | null>(null);
    const [useFileUpload, setUseFileUpload] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanningIntervalRef = useRef<number | null>(null);
    const qrCodeContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    // Detect if browser is Safari/iOS
    const isSafariOrIOS = useMemo(() => {
        if (typeof window === "undefined") return false;
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
        return isIOS || isSafari;
    }, []);

    // Check if camera API is available
    const isCameraAvailable = useMemo(() => {
        if (typeof window === "undefined" || typeof navigator === "undefined") return false;
        const isSecureContext = window.isSecureContext || 
            window.location.protocol === 'https:' || 
            window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1';
        return isSecureContext && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
    }, []);

    const handleScannedCode = async (code: string) => {
        // Stop scanner after successful scan (with error handling)
        try {
            await stopQRScanner();
        } catch {
            // Ignore errors when stopping scanner
        }

        // Parse the scanned code - it might be JSON (old format) or just the ticket code (new format)
        let ticketCode = code.trim();
        
        // Check if it's already a valid ticket code format (TKT-{number}-{hash})
        const ticketCodePattern = /^TKT-\d+-[A-Z0-9]{8}$/;
        if (ticketCodePattern.test(ticketCode)) {
            // It's already a ticket code, use it directly
        } else {
            // Try to parse as JSON (for backward compatibility with old QR codes)
            try {
                const parsed = JSON.parse(code);
                if (parsed && typeof parsed === 'object') {
                    if (parsed.code && typeof parsed.code === 'string') {
                        ticketCode = parsed.code;
                    } else {
                        // If JSON doesn't have code field, it might be malformed
                        throw new Error("QR code format not recognized. Expected ticket code or JSON with 'code' field.");
                    }
                }
            } catch {
                // If parsing fails and it's not a valid ticket code, show error
                setVerificationResult({
                    success: false,
                    message: "Invalid QR code format. Please scan a valid ticket QR code.",
                });
                setIsScanning(false);
                return;
            }
        }

        // Verify the scanned code
        setIsScanning(true);
        setVerificationResult(null);

        try {
            const result = await onVerifyAttendee(ticketCode);
            setVerificationResult(result);
            
            // Auto-close after successful verification
            if (result.success) {
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setVerificationResult({
                success: false,
                message: error instanceof Error ? error.message : "Failed to verify attendee",
            });
        } finally {
            setIsScanning(false);
        }
    };

    const startQRScanner = async () => {
        // Ensure container exists and is in the DOM
        if (!qrCodeContainerRef.current || !document.body.contains(qrCodeContainerRef.current)) {
            console.warn("QR scanner container not ready");
            return;
        }

        // For Safari/iOS, use file upload instead
        if (isSafariOrIOS) {
            setUseFileUpload(true);
            setCameraError("Camera streaming not supported on iOS Safari. Please upload a QR code image.");
            return;
        }

        // Check if camera is available
        if (!isCameraAvailable) {
            setUseFileUpload(true);
            const isSecureContext = window.isSecureContext || 
                window.location.protocol === 'https:' || 
                window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
            
            if (!isSecureContext) {
                setCameraError("Camera access requires HTTPS. Please use a secure connection (https://) or localhost.");
            } else {
                setCameraError("Camera API not available in this browser. Please use a modern browser or upload a QR code image.");
            }
            return;
        }

        // Stop any existing scanner first
        await stopQRScanner();

        try {
            setCameraError(null);
            setIsCameraActive(true);
            setUseFileUpload(false);


            // Ensure video and canvas elements exist
            if (!videoRef.current || !canvasRef.current) {
                throw new Error("Video or canvas element not available");
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (!context) {
                throw new Error("Could not get canvas context");
            }

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            streamRef.current = stream;
            video.srcObject = stream;
            video.setAttribute("playsinline", "true");
            await video.play();

            // Set canvas dimensions to match video
            const updateCanvasSize = () => {
                if (video.videoWidth && video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }
            };

            video.addEventListener("loadedmetadata", updateCanvasSize);
            updateCanvasSize();

            // Start scanning loop
            const scanQRCode = () => {
                if (!video || !canvas || !context || !streamRef.current) {
                    return;
                }

                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    // Draw video frame to canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Get image data from canvas
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                    // Try to decode QR code
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        // QR code found! Stop scanning immediately
                        if (scanningIntervalRef.current !== null) {
                            window.cancelAnimationFrame(scanningIntervalRef.current);
                            scanningIntervalRef.current = null;
                        }
                        void handleScannedCode(code.data);
                        return;
                    }
                }

                // Continue scanning
                if (streamRef.current) {
                    scanningIntervalRef.current = window.requestAnimationFrame(scanQRCode);
                }
            };

            // Start scanning
            scanningIntervalRef.current = window.requestAnimationFrame(scanQRCode);
        } catch (error) {
            console.error("Error starting QR scanner:", error);
            setCameraError(
                error instanceof Error
                    ? error.message
                    : "Failed to start camera. Please check permissions."
            );
            setIsCameraActive(false);
            await stopQRScanner();
            setUseFileUpload(true);
        }
    };

    const stopQRScanner = async () => {
        // Stop scanning loop
        if (scanningIntervalRef.current !== null) {
            window.cancelAnimationFrame(scanningIntervalRef.current);
            scanningIntervalRef.current = null;
        }

        // Stop video stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
            streamRef.current = null;
        }

        // Clear video source
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

            setIsCameraActive(false);
            setCameraError(null);
    };

    const handleManualInput = async () => {
        if (!scannedCode.trim()) {
            setVerificationResult({
                success: false,
                message: "Please enter a ticket code",
            });
            return;
        }

        setIsScanning(true);
        setVerificationResult(null);

        try {
            const result = await onVerifyAttendee(scannedCode.trim());
            setVerificationResult(result);
            
            if (result.success) {
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setVerificationResult({
                success: false,
                message: error instanceof Error ? error.message : "Failed to verify attendee",
            });
        } finally {
            setIsScanning(false);
        }
    };

    const handleQRCodeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setVerificationResult(null);
        setCameraError(null);

        try {
            // Create image from file
            const imageUrl = URL.createObjectURL(file);
            const img = new Image();
            
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
                img.src = imageUrl;
            });

            // Create canvas to get image data
            if (!canvasRef.current) {
                throw new Error("Canvas not available");
            }

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (!context) {
                throw new Error("Could not get canvas context");
            }

            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // Get image data
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Decode QR code
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            // Clean up
            URL.revokeObjectURL(imageUrl);

            if (!code) {
                throw new Error("No QR code found in image");
            }

            await handleScannedCode(code.data);
        } catch (err) {
            console.error("Error scanning QR code from file:", err);
            setVerificationResult({
                success: false,
                message: err instanceof Error
                    ? err.message
                    : "Failed to scan QR code. Please try another image or enter the code manually.",
            });
        } finally {
            setIsScanning(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const resetScanner = () => {
        setScannedCode("");
        setVerificationResult(null);
        setIsScanning(false);
        setCameraError(null);
        void stopQRScanner();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Start scanner when modal opens
    useEffect(() => {
        if (!isOpen) {
            // Clean up when closing
            const cleanup = async () => {
                try {
                    await stopQRScanner();
                } catch {
                    // Ignore cleanup errors
                }
                resetScanner();
                setUseFileUpload(false);
            };
            void cleanup();
            return;
        }

        // Reset state when opening
        resetScanner();

        if (isSafariOrIOS) {
            setUseFileUpload(true);
            return;
        }

        // Wait for DOM to be ready before starting scanner
        let mounted = true;
        let scannerStarted = false;
        
        // Use multiple checks to ensure DOM is ready
        const checkAndStart = async () => {
            if (!mounted || scannerStarted) return;
            
            // Check if container, video, and canvas elements exist and are in DOM
            if (!qrCodeContainerRef.current || !videoRef.current || !canvasRef.current) {
                setTimeout(checkAndStart, 50);
                return;
            }
            
            const container = qrCodeContainerRef.current;
            if (!document.body.contains(container)) {
                setTimeout(checkAndStart, 50);
                return;
            }
            
            scannerStarted = true;
            try {
                await startQRScanner();
            } catch (error) {
                console.error("Failed to start scanner:", error);
                scannerStarted = false;
            }
        };

        // Start checking after a delay
        const startTimer = setTimeout(() => {
            if (mounted) {
                void checkAndStart();
            }
        }, 300);

        return () => {
            mounted = false;
            scannerStarted = false;
            clearTimeout(startTimer);
            
            // Cleanup scanner
            void stopQRScanner();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 p-4 sm:p-6 text-white">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                            >
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pr-8">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 shrink-0">
                                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-base sm:text-lg font-bold">
                                        QR Scanner
                                    </h2>
                                    <p className="text-xs sm:text-sm text-white/70 truncate">
                                        {eventName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            <div className="space-y-4">
                                {isSafariOrIOS || useFileUpload ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                                                Upload QR Code Image
                                            </label>
                                            {!isSafariOrIOS && (
                                                <button
                                                    onClick={() => {
                                                        setUseFileUpload(false);
                                                        void startQRScanner();
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                                                >
                                                    <Camera className="w-3.5 h-3.5" />
                                                    Use Camera
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleQRCodeFileUpload}
                                            className="w-full text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-neutral-900 dark:file:bg-white file:text-white dark:file:text-neutral-900 hover:file:bg-neutral-800 dark:hover:file:bg-neutral-100"
                                        />
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                            {isSafariOrIOS
                                                ? "Safari on iOS doesn&apos;t support camera streaming. Please upload a photo of the QR code."
                                                : "Camera failed to start. Please upload a photo of the QR code."}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* QR Code Scanner */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                                                    Scan QR Code
                                                </label>
                                                {isCameraActive && (
                                                    <button
                                                        onClick={async () => {
                                                            await stopQRScanner();
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                                    >
                                                        <CameraOff className="w-3.5 h-3.5" />
                                                        Stop Scanner
                                                    </button>
                                                )}
                                            </div>
                                            <div
                                                ref={qrCodeContainerRef}
                                                className="w-full rounded-lg overflow-hidden bg-neutral-900 relative"
                                                style={{ minHeight: "300px" }}
                                            >
                                                <video
                                                    ref={videoRef}
                                                    className="w-full h-full object-cover"
                                                    playsInline
                                                    muted
                                                    style={{ display: isCameraActive ? "block" : "none" }}
                                                />
                                                <canvas
                                                    ref={canvasRef}
                                                    className="hidden"
                                                />
                                                {!isCameraActive && !cameraError && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <Camera className="w-12 h-12 text-neutral-600 dark:text-neutral-500 mx-auto mb-2" />
                                                            <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                                                Camera will start automatically
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {cameraError && (
                                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                                    {cameraError}
                                                </p>
                                            )}
                                            {isCameraActive && (
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                                                    Point camera at QR code to scan
                                                </p>
                                            )}
                                        </div>
                                        {!isSafariOrIOS && (
                                            <button
                                                onClick={() => {
                                                    void stopQRScanner();
                                                    setUseFileUpload(true);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors w-full justify-center"
                                            >
                                                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Use File Upload Instead
                                            </button>
                                        )}
                                    </>
                                )}

                                <div className="relative mt-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
                                            OR
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-neutral-900 dark:text-white mb-2">
                                        Enter Ticket Code Manually
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={scannedCode}
                                            onChange={(e) => setScannedCode(e.target.value.toUpperCase())}
                                            placeholder="TKT-3-89B6E1DC"
                                            className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    void handleManualInput();
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={handleManualInput}
                                            disabled={isScanning || !scannedCode.trim()}
                                            className="px-3 sm:px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            {isScanning ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                                    <span className="hidden xs:inline">Verifying...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="hidden xs:inline">Verify</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Verification Result */}
                                {verificationResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-3 rounded-lg flex items-start gap-2 ${
                                            verificationResult.success
                                                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                                                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                                        }`}
                                    >
                                        {verificationResult.success ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p
                                                className={`text-xs sm:text-sm font-medium ${
                                                    verificationResult.success
                                                        ? "text-emerald-700 dark:text-emerald-400"
                                                        : "text-red-700 dark:text-red-400"
                                                }`}
                                            >
                                                {verificationResult.message}
                                            </p>
                                            {verificationResult.success && verificationResult.attendee && (
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                                    {verificationResult.attendee.user?.email || `User ID: ${verificationResult.attendee.userId}`}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

