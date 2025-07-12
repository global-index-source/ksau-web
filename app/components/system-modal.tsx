"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SystemInfo } from "./system-info";
import { Activity } from "lucide-react";

interface SystemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SystemModal({ open, onOpenChange }: SystemModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <SystemInfo />
        </div>
      </DialogContent>
    </Dialog>
  );
}