"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OrganizationForm } from "./organization-form";

interface OrganizationFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrganizationFormDialog({
    open,
    onOpenChange,
}: OrganizationFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-4xl w-full h-[90vh] p-0 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col"
                onClose={() => onOpenChange(false)}
            >
                <OrganizationForm onClose={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

