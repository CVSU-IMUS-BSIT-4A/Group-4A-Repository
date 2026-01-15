"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  Archive,
  Pencil,
  ArchiveRestore,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface User {
  uid: number
  email: string
  role: string
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  userDetail?: {
    first_name: string
    last_name: string
    gender: string | null
    dob: string | null
    phone_number: string | null
    date_of_birth: string | null
    address: string | null
  }
}

export type UserWithActions = User & {
  onEdit?: (user: User) => void
  onArchive?: (user: User) => void
}

const getRoleBadge = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return (
        <Badge variant="default" className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="border-neutral-200 dark:border-neutral-700">
          <UserIcon className="w-3 h-3 mr-1" />
          User
        </Badge>
      )
  }
}

export const columns: ColumnDef<UserWithActions>[] = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => {
      const user = row.original
      const firstName = user.userDetail?.first_name || ""
      const lastName = user.userDetail?.last_name || ""
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U"
      
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/10">
          <span className="text-sm font-semibold text-primary">{initials}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      const firstName = user.userDetail?.first_name || ""
      const lastName = user.userDetail?.last_name || ""
      const fullName = `${firstName} ${lastName}`.trim() || "No name"
      
      return (
        <div>
          <div className="font-semibold text-neutral-900 dark:text-white">
            {fullName}
          </div>
          <div className="text-xs text-muted-foreground">
            ID: {user.uid}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="truncate max-w-50">{user.email}</span>
          </div>
          {user.isEmailVerified && (
            <Badge variant="outline" className="text-xs border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-2 h-2 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.userDetail?.gender
      const capitalizedGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "N/A"
      return (
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {capitalizedGender}
        </span>
      )
    },
  },
  {
    accessorKey: "birthdate",
    header: "Birthdate",
    cell: ({ row }) => {
      const dob = row.original.userDetail?.dob
      return (
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {dob ? new Date(dob).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : "N/A"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return getRoleBadge(row.original.role)
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original

      // Don't show actions if no callbacks are provided (current user)
      if (!user.onEdit && !user.onArchive) {
        return null
      }

      return (
        <div className="flex items-center gap-1">
          {user.onEdit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => user.onEdit?.(user)}
              className="h-8 w-8"
              title="Edit user"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {user.onArchive && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => user.onArchive?.(user)}
              className={user.isActive 
                ? "h-8 w-8 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                : "h-8 w-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
              }
              title={user.isActive ? "Archive user" : "Restore user"}
            >
              {user.isActive ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
            </Button>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
]
