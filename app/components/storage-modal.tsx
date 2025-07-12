"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StorageQuota } from "./storage-quota";
import { Database } from "lucide-react";

interface StorageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StorageModal({ open, onOpenChange }: StorageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Usage
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <StorageQuota />
        </div>
      </DialogContent>
    </Dialog>
  );
}