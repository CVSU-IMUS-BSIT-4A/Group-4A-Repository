"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IndividualForm } from "./individual-form";

interface IndividualFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function IndividualFormDialog({ open, onOpenChange }: IndividualFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-lg w-[900px] aspect-square p-0 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                onClose={() => onOpenChange(false)}
            >
                <IndividualForm onClose={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

