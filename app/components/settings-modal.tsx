"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Settings, Github, Terminal, ExternalLink } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Guidelines & Info
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Usage Guidelines */}
          <div className="space-y-3">
            <h4 className="font-medium">Acceptable Files</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Development builds and test files</li>
              <li>• Project assets for testing</li>
              <li>• Documentation and resources</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Storage Policy</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Files removed at 90% capacity</li>
              <li>• Contact maintainers for file deletion</li>
              <li>• Best-effort storage basis</li>
            </ul>
          </div>

          {/* CLI Information */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="font-medium">CLI Integration</h4>
            <p className="text-sm text-muted-foreground">
              Use our command-line tool for batch uploads and automation.
            </p>
            <a
              href="https://github.com/global-index-source/ksau-go"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Terminal className="h-4 w-4" />
              ksau-go CLI Tool
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Project Info */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="font-medium">Project Maintainers</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">ksauraj</Badge>
              <Badge variant="secondary">hakimi</Badge>
              <Badge variant="secondary">pratham</Badge>
            </div>
            <a
              href="https://github.com/global-index-source/ksau-go"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}