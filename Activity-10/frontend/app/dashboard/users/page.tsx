"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Users, Loader2, UserPlus, CheckCircle2, AlertCircle, XCircle, Download, ChevronDown, FileText, Table } from "lucide-react"
import { columns, type UserWithActions } from "@/components/dashboard/users-table/columns"
import { DataTable } from "@/components/dashboard/users-table/data-table"
import { Button } from "@/components/ui/button"
import { getAllUsers, createUser, updateUser, archiveUser, restoreUser } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<UserWithActions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<'active' | 'archived'>(
    (searchParams.get('tab') as 'active' | 'archived') || 'active'
  )
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithActions | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [createdUser, setCreatedUser] = useState<{
    uid: number
    email: string
    role: string
    first_name: string
    last_name: string
    gender?: string | null
    dob?: string | null
  } | null>(null)
  
  // Confirmation modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmTitle, setConfirmTitle] = useState("")
  
  // Message modal states
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [messageText, setMessageText] = useState("")
  const [messageTitle, setMessageTitle] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  
  const [newUserData, setNewUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthdate: "",
    role: "user",
  })

  const [editUserData, setEditUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthdate: "",
    role: "user",
  })

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const isActive = activeFilter === 'active'
      const response = await getAllUsers(undefined, undefined, isActive)
      setUsers(response.data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      setMessageType('error')
      setMessageTitle('Error')
      setMessageText('Failed to load users. Please try again.')
      setIsMessageModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }, [activeFilter])

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setCurrentUserId(Number(user.id))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    fetchUsers()
  }, [fetchUsers])

  const handleAddUser = () => {
    setIsAddUserModalOpen(true)
  }

  const handleFilterChange = (filter: 'active' | 'archived') => {
    setActiveFilter(filter)
    router.push(`/dashboard/users?tab=${filter}`, { scroll: false })
  }

  const handleCloseModal = () => {
    setIsAddUserModalOpen(false)
    setNewUserData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
      birthdate: "",
      role: "user",
    })
  }

  const handleSubmitNewUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await createUser({
        email: newUserData.email,
        password: newUserData.password,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        role: newUserData.role,
        gender: newUserData.gender || undefined,
        birthdate: newUserData.birthdate || undefined,
      })
      
      setCreatedUser(response.data)
      handleCloseModal()
      setIsSuccessModalOpen(true)
      fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      setMessageType('error')
      setMessageTitle('Error')
      setMessageText(error instanceof Error ? error.message : 'Failed to create user. Please try again.')
      setIsMessageModalOpen(true)
    }
  }

  const handleEditUser = (user: UserWithActions) => {
    setEditingUser(user)
    setEditUserData({
      email: user.email,
      password: "",
      firstName: user.userDetail?.first_name || "",
      lastName: user.userDetail?.last_name || "",
      gender: user.userDetail?.gender || "",
      birthdate: user.userDetail?.dob ? new Date(user.userDetail.dob).toISOString().split('T')[0] : "",
      role: user.role.toLowerCase(),
    })
    setIsEditUserModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditUserModalOpen(false)
    setEditingUser(null)
    setEditUserData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
      birthdate: "",
      role: "user",
    })
  }

  const handleSubmitEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUser) return

    try {
      const updateData: any = {
        email: editUserData.email,
        firstName: editUserData.firstName,
        lastName: editUserData.lastName,
        role: editUserData.role,
        gender: editUserData.gender || undefined,
        birthdate: editUserData.birthdate || undefined,
      }

      // Only include password if it was changed
      if (editUserData.password) {
        updateData.password = editUserData.password
      }

      await updateUser(editingUser.uid, updateData)
      
      setMessageType('success')
      setMessageTitle('Success')
      setMessageText('User updated successfully')
      setIsMessageModalOpen(true)
      handleCloseEditModal()
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      setMessageType('error')
      setMessageTitle('Error')
      setMessageText(error instanceof Error ? error.message : 'Failed to update user. Please try again.')
      setIsMessageModalOpen(true)
    }
  }

  const handleArchiveUser = async (user: UserWithActions) => {
    const isActive = user.isActive
    const action = isActive ? 'archive' : 'restore'
    
    setConfirmTitle(isActive ? 'Archive User' : 'Restore User')
    setConfirmMessage(
      isActive 
        ? `Are you sure you want to archive ${user.email}? The user will not be able to log in.`
        : `Are you sure you want to restore ${user.email}? The user will be able to log in again.`
    )
    setConfirmAction(() => async () => {
      try {
        if (isActive) {
          await archiveUser(user.uid)
        } else {
          await restoreUser(user.uid)
        }
        setMessageType('success')
        setMessageTitle('Success')
        setMessageText(`User ${action}d successfully!`)
        setIsMessageModalOpen(true)
        fetchUsers()
      } catch (error) {
        console.error(`Error ${action}ing user:`, error)
        setMessageType('error')
        setMessageTitle('Error')
        setMessageText(error instanceof Error ? error.message : `Failed to ${action} user. Please try again.`)
        setIsMessageModalOpen(true)
      }
    })
    setIsConfirmModalOpen(true)
  }

  const exportToCSV = () => {
    setIsExporting(true)
    try {
      const csvData = users.map(user => ({
        'User ID': user.uid,
        'Email': user.email,
        'First Name': user.userDetail?.first_name || '',
        'Last Name': user.userDetail?.last_name || '',
        'Gender': user.userDetail?.gender || '',
        'Birthdate': user.userDetail?.dob || '',
        'Role': user.role,
        'Status': user.isActive ? 'Active' : 'Archived',
        'Joined Date': new Date(user.createdAt).toLocaleDateString(),
      }))

      const headers = Object.keys(csvData[0] || {})
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => {
          const value = row[header as keyof typeof row]
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `users-${activeFilter}-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      setMessageType('error')
      setMessageTitle('Export Failed')
      setMessageText('Failed to export CSV file. Please try again.')
      setIsMessageModalOpen(true)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default
      
      const doc = new jsPDF()
      
      doc.setFontSize(18)
      doc.text(`Users - ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`, 14, 20)
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)

      const tableData = users.map(user => [
        user.uid.toString(),
        user.email,
        `${user.userDetail?.first_name || ''} ${user.userDetail?.last_name || ''}`.trim() || 'N/A',
        user.userDetail?.gender || 'N/A',
        user.userDetail?.dob ? new Date(user.userDetail.dob).toLocaleDateString() : 'N/A',
        user.role,
        user.isActive ? 'Active' : 'Archived',
        new Date(user.createdAt).toLocaleDateString(),
      ])

      autoTable(doc, {
        head: [['ID', 'Email', 'Name', 'Gender', 'Birthdate', 'Role', 'Status', 'Joined']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 0, 0] },
      })

      doc.save(`users-${activeFilter}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      setMessageType('error')
      setMessageTitle('Export Failed')
      setMessageText('Failed to export PDF file. Please try again.')
      setIsMessageModalOpen(true)
    } finally {
      setIsExporting(false)
    }
  }

  const usersWithActions: UserWithActions[] = users.map(user => ({
    ...user,
    onEdit: currentUserId !== user.uid ? handleEditUser : undefined,
    onArchive: currentUserId !== user.uid ? handleArchiveUser : undefined,
  }))

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
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
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Users className="h-6 w-6" />
                Users Management
              </h1>
              <p className="text-muted-foreground">
                View and manage all users in the system
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isExporting}>
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToCSV}>
                    <Table className="h-4 w-4 mr-2" />
                    Download CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="w-fit" onClick={handleAddUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Users DataTable */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12 border rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={usersWithActions}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </SidebarInset>

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitNewUser} className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Create a new user account. Fill in the required information below.
            </p>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={newUserData.firstName}
                    onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={newUserData.lastName}
                    onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={newUserData.gender}
                    onChange={(e) => setNewUserData({ ...newUserData, gender: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={newUserData.birthdate}
                    onChange={(e) => setNewUserData({ ...newUserData, birthdate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEditUser} className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Update user account information. Leave password empty to keep current password.
            </p>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="user@example.com"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">Password (leave empty to keep current)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="Enter new password"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                  minLength={8}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstName">First Name *</Label>
                  <Input
                    id="edit-firstName"
                    type="text"
                    placeholder="John"
                    value={editUserData.firstName}
                    onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName">Last Name *</Label>
                  <Input
                    id="edit-lastName"
                    type="text"
                    placeholder="Doe"
                    value={editUserData.lastName}
                    onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <select
                    id="edit-gender"
                    value={editUserData.gender}
                    onChange={(e) => setEditUserData({ ...editUserData, gender: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-birthdate">Birthdate</Label>
                  <Input
                    id="edit-birthdate"
                    type="date"
                    value={editUserData.birthdate}
                    onChange={(e) => setEditUserData({ ...editUserData, birthdate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role *</Label>
                <select
                  id="edit-role"
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6" />
              User Created Successfully
            </DialogTitle>
          </DialogHeader>
          {createdUser && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  The new user account has been created successfully!
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-medium">{createdUser.uid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{createdUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">
                      {createdUser.first_name} {createdUser.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium capitalize">{createdUser.role}</span>
                  </div>
                  {createdUser.gender && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-medium">
                        {createdUser.gender.charAt(0).toUpperCase() + createdUser.gender.slice(1)}
                      </span>
                    </div>
                  )}
                  {createdUser.dob && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Birthdate:</span>
                      <span className="font-medium">
                        {new Date(createdUser.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsSuccessModalOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              {confirmTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-muted-foreground">{confirmMessage}</p>
          </div>
          <div className="flex justify-end gap-2 px-6 pb-6">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setIsConfirmModalOpen(false)
                confirmAction()
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${
              messageType === 'success' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              {messageTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <div className={`p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <p className={`text-sm ${
                messageType === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {messageText}
              </p>
            </div>
          </div>
          <div className="flex justify-end px-6 pb-6">
            <Button onClick={() => setIsMessageModalOpen(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
