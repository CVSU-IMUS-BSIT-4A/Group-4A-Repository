"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building2,
  Users,
  Home,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  const router = useRouter()
  const { state } = useSidebar()

  // Get user data from localStorage if not provided
  const [currentUser, setCurrentUser] = React.useState(user || {
    name: "Admin",
    email: "",
    avatar: undefined,
  })

  React.useEffect(() => {
    if (!user) {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const parsed = JSON.parse(userData)
          setCurrentUser({
            name: `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || "Admin",
            email: parsed.email || "",
            avatar: undefined,
          })
        }
      } catch {
        // Ignore errors
      }
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/signin")
  }

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Organizations",
      url: "/dashboard/organizations",
      icon: Building2,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-2 hover:opacity-80 transition-opacity">
          <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600" />
          {state !== "collapsed" && (
            <span className="truncate font-semibold text-sm">VenueFlow</span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={currentUser}
          onLogout={handleLogout}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

