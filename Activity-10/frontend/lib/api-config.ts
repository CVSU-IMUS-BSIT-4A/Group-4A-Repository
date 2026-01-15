/**
 * API Configuration Utility
 * Handles API URL detection for mobile and desktop access
 */

export function getApiBaseUrl(): string {
  // Check if API URL is set in environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Only run on client side
  if (typeof window === 'undefined') {
    return 'http://localhost:3005';
  }

  // Check if stored in localStorage (for manual configuration)
  const storedUrl = localStorage.getItem('api_base_url');
  if (storedUrl) {
    return storedUrl;
  }

  // Auto-detect: if accessing from mobile/network, use the same hostname
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // On mobile/network, use the same hostname with port 3005
    return `http://${hostname}:3005`;
  }

  // Default to localhost for desktop development
  return 'http://localhost:3005';
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('api_base_url', url);
    // Reload to apply new URL
    window.location.reload();
  }
}

export function clearApiBaseUrl(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('api_base_url');
  }
}

