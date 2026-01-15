"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type Organization } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Clock,
  Mail,
  Globe,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const getStatusBadge = (status: Organization["status"]) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      )
  }
}

export type OrganizationWithActions = Organization & {
  onEdit?: (org: Organization) => void
  onDelete?: (org: Organization) => void
}

export const columns: ColumnDef<OrganizationWithActions>[] = [
  {
    accessorKey: "logo",
    header: "",
    cell: ({ row }) => {
      const org = row.original
      return (
        <div className="w-10 h-10">
          {org.logo ? (
            <Image
              src={org.logo}
              alt={org.name}
              width={40}
              height={40}
              className="rounded-lg object-cover w-full h-full"
              unoptimized={org.logo.startsWith('data:')}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-neutral-400" />
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const org = row.original
      return (
        <div className="font-semibold text-neutral-900 dark:text-white">
          {org.name}
        </div>
      )
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const org = row.original
      return (
        <div className="space-y-1 text-sm">
          {org.email && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-[200px]">{org.email}</span>
            </div>
          )}
          {org.phone && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{org.phone}</span>
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const org = row.original
      return org.website ? (
        <a
          href={org.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Globe className="w-3 h-3" />
          <span className="truncate max-w-[150px]">{org.website}</span>
        </a>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const org = row.original
      return org.address ? (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[150px]">{org.address}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return getStatusBadge(row.original.status)
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const org = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => org.onEdit?.(org)}
            className="h-8 w-8"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => org.onDelete?.(org)}
            className="h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
    enableSorting: false,
  },
]

