"use client"

import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Remove snap classes from html for dashboard
    const html = document.documentElement
    html.classList.remove("snap-y", "snap-mandatory")
    
    return () => {
      // Restore on unmount if needed
      html.classList.add("snap-y", "snap-mandatory")
    }
  }, [])

  return <>{children}</>
}

