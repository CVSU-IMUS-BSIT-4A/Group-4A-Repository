"use client"

import { useEffect, useState } from "react"
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
  getAllOrganizations,
  deleteOrganization,
  verifyOrganization,
  updateOrganization,
  type Organization,
} from "@/lib/api"
import {
  Building2,
  FileText,
  Loader2,
  Inbox,
  Eye,
  Check,
  Ban,
  Globe,
  Mail,
  Phone,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/organizations-table/data-table"
import { columns, type OrganizationWithActions } from "@/components/dashboard/organizations-table/columns"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [orgToProcess, setOrgToProcess] = useState<Organization | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [pendingOrganizations, setPendingOrganizations] = useState<Organization[]>([])
  const [isPendingLoading, setIsPendingLoading] = useState(false)
  const [requestsDialogOpen, setRequestsDialogOpen] = useState(false)

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await getAllOrganizations("approved", searchQuery)
      setOrganizations(response.data)
    } catch (err) {
      console.error("Failed to fetch organizations:", err)
      setError(err instanceof Error ? err.message : "Failed to load organizations")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPendingOrganizations = async () => {
    try {
      setIsPendingLoading(true)
      const response = await getAllOrganizations("pending")
      setPendingOrganizations(response.data)
    } catch (err) {
      console.error("Failed to fetch pending organizations:", err)
    } finally {
      setIsPendingLoading(false)
    }
  }

  const handleApprove = (org: Organization) => {
    setOrgToProcess(org)
    setApproveDialogOpen(true)
  }

  const confirmApprove = async () => {
    if (!orgToProcess) return

    try {
      setIsSubmitting(true)
      await verifyOrganization(orgToProcess.id, { approved: true })
      await fetchPendingOrganizations()
      await fetchOrganizations() // Refresh main list too
      setApproveDialogOpen(false)
      setOrgToProcess(null)
    } catch (err) {
      console.error("Failed to approve organization:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = (org: Organization) => {
    setOrgToProcess(org)
    setRejectionReason("")
    setRejectDialogOpen(true)
  }

  const confirmReject = async () => {
    if (!orgToProcess) return

    try {
      setIsSubmitting(true)
      await verifyOrganization(orgToProcess.id, { approved: false, rejectionReason })
      await fetchPendingOrganizations()
      setRejectDialogOpen(false)
      setOrgToProcess(null)
      setRejectionReason("")
    } catch (err) {
      console.error("Failed to reject organization:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void fetchPendingOrganizations()
  }, [])

  useEffect(() => {
    if (requestsDialogOpen) {
      void fetchPendingOrganizations()
    }
  }, [requestsDialogOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchOrganizations()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleEditClick = (org: Organization) => {
    setSelectedOrg(org)
    setEditFormData({
      name: org.name || "",
      description: org.description || "",
      email: org.email || "",
      phone: org.phone || "",
      website: org.website || "",
      address: org.address || "",
    })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (org: Organization) => {
    setSelectedOrg(org)
    setDeleteDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedOrg) return

    try {
      setIsSubmitting(true)
      setError(null)

      await updateOrganization(selectedOrg.id, editFormData)
      
      setEditDialogOpen(false)
      setSuccessMessage(`"${selectedOrg.name}" has been successfully updated.`)
      setSuccessDialogOpen(true)
      setSelectedOrg(null)
      await fetchOrganizations()
    } catch (err) {
      setEditDialogOpen(false)
      setErrorMessage(err instanceof Error ? err.message : "Failed to update organization")
      setErrorDialogOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedOrg) return

    try {
      setIsSubmitting(true)
      setError(null)

      await deleteOrganization(selectedOrg.id)
      
      setDeleteDialogOpen(false)
      setSuccessMessage(`"${selectedOrg.name}" has been successfully deleted.`)
      setSuccessDialogOpen(true)
      setSelectedOrg(null)
      await fetchOrganizations()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete organization")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add action handlers to organizations for the table
  const organizationsWithActions: OrganizationWithActions[] = organizations.map((org) => ({
    ...org,
    onEdit: (org) => handleEditClick(org),
    onDelete: (org) => handleDeleteClick(org),
  }))

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
                <BreadcrumbPage>Organizations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <FileText className="h-4 w-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
              <p className="text-muted-foreground">
                Manage and verify organization requests
              </p>
            </div>
            <Button onClick={() => setRequestsDialogOpen(true)} size="icon" variant="outline" title="Pending Requests" className="relative">
              <Inbox className="w-4 h-4" />
              {pendingOrganizations.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center border-2 border-white dark:border-neutral-950">
                  {pendingOrganizations.length}
                </span>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
          ) : organizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="w-12 h-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No organizations found
              </h3>
              <p className="text-sm text-muted-foreground">
                No organizations to display
              </p>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={organizationsWithActions}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </div>

        {/* Requests Modal */}
        <Dialog open={requestsDialogOpen} onOpenChange={setRequestsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Pending Organization Requests</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <DialogBody className="flex-1 overflow-auto p-0">
              <div className="p-4">
                {isPendingLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                  </div>
                ) : pendingOrganizations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="w-12 h-12 text-neutral-400 mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      No pending requests
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      There are no organization requests to review
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingOrganizations.map((org) => (
                      <Collapsible
                        key={org.id}
                        className="border rounded-lg p-4 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                                <span className="font-semibold text-lg block">{org.name}</span>
                                {org.organizationUsers?.[0]?.user && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                        <User className="w-3 h-3" />
                                        <span>
                                            Requested by: {org.organizationUsers[0].user.userDetail 
                                                ? `${org.organizationUsers[0].user.userDetail.first_name} ${org.organizationUsers[0].user.userDetail.last_name}`
                                                : "Unknown"} 
                                            <span className="opacity-70 ml-1">({org.organizationUsers[0].user.email})</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <Eye className="w-4 h-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>
                        <CollapsibleContent className="mt-4 pt-4 border-t space-y-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Logo */}
                            <div className="shrink-0">
                              {org.logo ? (
                                <Image
                                  src={org.logo}
                                  alt={org.name}
                                  width={100}
                                  height={100}
                                  className="rounded-lg object-cover bg-white border"
                                  unoptimized={org.logo.startsWith("data:")}
                                />
                              ) : (
                                <div className="w-[100px] h-[100px] rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border">
                                  <Building2 className="w-8 h-8 text-neutral-400" />
                                </div>
                              )}
                            </div>
                            
                            {/* Details Grid */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</span>
                                <p className="text-neutral-900 dark:text-neutral-100">{org.description || "No description provided"}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Website</span>
                                {org.website ? (
                                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                                    <Globe className="w-3 h-3" />
                                    {org.website}
                                  </a>
                                ) : (
                                  <p className="text-muted-foreground flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Not provided
                                  </p>
                                )}
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</span>
                                {org.email ? (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                    <span>{org.email}</span>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground">Not provided</p>
                                )}
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</span>
                                {org.phone ? (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                    <span>{org.phone}</span>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground">Not provided</p>
                                )}
                              </div>

                              <div className="space-y-1 md:col-span-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</span>
                                {org.address ? (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-muted-foreground" />
                                    <span>{org.address}</span>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground">Not provided</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                             <Button 
                                variant="outline" 
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900" 
                                onClick={() => handleReject(org)}
                                title="Reject"
                              >
                               <Ban className="w-4 h-4" />
                               <span className="sr-only">Reject</span>
                             </Button>
                             <Button 
                               size="icon"
                               className="bg-green-600 hover:bg-green-700 text-white" 
                               onClick={() => handleApprove(org)}
                               title="Approve"
                              >
                               <Check className="w-4 h-4" />
                               <span className="sr-only">Approve</span>
                             </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>

        {/* Approve Confirmation Dialog */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-2 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <DialogTitle className="text-xl font-semibold">Approve Organization</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-5 px-6 py-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Are you sure you want to approve this organization request?
                </p>
                <div className="mt-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 p-3 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {orgToProcess?.name}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                  ✓ The organization will be listed on the public directory<br />
                  ✓ The administrator will be notified of approval
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setApproveDialogOpen(false)}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApprove}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reject Confirmation Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="space-y-2 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle className="text-xl font-semibold">Reject Organization</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-5 px-6 py-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  You are about to reject this organization request. Please provide a detailed reason.
                </p>
                <div className="mt-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 p-3 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {orgToProcess?.name}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="reason" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Rejection Reason <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Provide a clear explanation (e.g., incomplete information, invalid documentation, duplicate organization...)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[110px] resize-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400"
                />
                {rejectionReason.trim() && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {rejectionReason.length} characters
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3.5 border border-amber-200 dark:border-amber-800">
                <div className="flex gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    The administrator will receive your rejection reason and can resubmit with corrections.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false)
                  setRejectionReason("")
                }}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReject}
                disabled={isSubmitting || !rejectionReason.trim()}
                variant="destructive"
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Organization Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-2 pb-6 border-b">
              <DialogTitle className="text-xl font-semibold">Edit Organization</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-5 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Organization Name <span className="text-red-600">*</span></Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Enter organization name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="contact@organization.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={editFormData.website}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Auto-prepend https:// if user starts typing without protocol
                      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                        value = 'https://' + value;
                      }
                      setEditFormData({ ...editFormData, website: value });
                    }}
                    onFocus={(e) => {
                      // Auto-set https:// when focused if empty
                      if (!e.target.value) {
                        setEditFormData({ ...editFormData, website: "https://" });
                      }
                    }}
                    placeholder="https://organization.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="Brief description of the organization..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  placeholder="Complete address..."
                  className="min-h-[80px] resize-none"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false)
                  setSelectedOrg(null)
                  setError(null)
                }}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isSubmitting || !editFormData.name.trim()}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Organization</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <DialogBody>
              <div className="px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete &quot;{selectedOrg?.name}&quot;? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-2 px-6 pb-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  variant="destructive"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>

        {/* Error Dialog */}
        <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-2 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle className="text-xl font-semibold">Error</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="px-6 py-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="flex justify-end px-6 pb-6 pt-4 border-t">
              <Button
                onClick={() => setErrorDialogOpen(false)}
                className="min-w-[100px]"
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-2 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <DialogTitle className="text-xl font-semibold">Success</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="px-6 py-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {successMessage}
              </p>
            </div>

            <div className="flex justify-end px-6 pb-6 pt-4 border-t">
              <Button
                onClick={() => setSuccessDialogOpen(false)}
                className="min-w-[100px]"
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}

