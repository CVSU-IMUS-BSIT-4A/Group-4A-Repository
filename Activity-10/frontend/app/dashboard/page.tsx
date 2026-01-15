"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/dashboard/admin-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react"
import { getAllUsers, getAllOrganizations, getAllEvents } from "@/lib/api"

interface DashboardStats {
  pendingOrganizations: number
  approvedOrganizations: number
  totalEvents: number
  totalUsers: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    pendingOrganizations: 0,
    approvedOrganizations: 0,
    totalEvents: 0,
    totalUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all data in parallel
        const [usersResponse, orgsResponse, eventsResponse] = await Promise.all([
          getAllUsers(),
          getAllOrganizations(),
          getAllEvents(1, 1000), // Get first 1000 events to count total
        ])

        const organizations = orgsResponse.data || []
        const events = eventsResponse.events || []
        const users = usersResponse.data || []

        setStats({
          pendingOrganizations: organizations.filter((org: any) => org.status === 'pending').length,
          approvedOrganizations: organizations.filter((org: any) => org.status === 'approved').length,
          totalEvents: eventsResponse.pagination?.total || events.length,
          totalUsers: users.length,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <a href="/dashboard">Dashboard</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your system.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Organizations</p>
                      <p className="text-2xl font-bold mt-1">{stats.pendingOrganizations}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved Organizations</p>
                      <p className="text-2xl font-bold mt-1">{stats.approvedOrganizations}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalEvents}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <button 
                      onClick={() => router.push('/dashboard/organizations')}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>Review Pending Organizations</span>
                      </div>
                      {stats.pendingOrganizations > 0 && (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2 py-1 rounded-full font-medium">
                          {stats.pendingOrganizations}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => router.push('/dashboard/events')}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>View All Events</span>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => router.push('/dashboard/users')}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Manage Users</span>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">System Overview</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <span className="text-sm font-medium">{stats.totalUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Organizations</span>
                      <span className="text-sm font-medium">{stats.approvedOrganizations + stats.pendingOrganizations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Events Published</span>
                      <span className="text-sm font-medium">{stats.totalEvents}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm font-medium">System Status</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                        Operational
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

