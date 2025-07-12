"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Database, HardDrive } from "lucide-react";
import { config } from "../config";

interface QuotaInfo {
  total: string;
  used: string;
  remaining: string;
  deleted: string;
}

interface QuotaData {
  hakimionedrive: QuotaInfo;
  oned: QuotaInfo;
  saurajcf: QuotaInfo;
}

export function StorageQuota() {
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        setError(null);
        const response = await fetch('/api/quota');
        const data = await response.json();
        if (data.status === "success") {
          setQuotaData(data.data);
        } else {
          setError("Failed to fetch quota data");
        }
      } catch (error) {
        setError("Error connecting to storage");
        console.error("Failed to fetch quota:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuota();
    // Refresh every 5 minutes
    const interval = setInterval(fetchQuota, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const calculatePercentage = (used: string, total: string) => {
    const usedValue = parseFloat(used.split(" ")[0]);
    const totalValue = parseFloat(total.split(" ")[0]);
    return (usedValue / totalValue) * 100;
  };

  const getStorageIcon = (remote: string) => {
    switch (remote) {
      case 'hakimionedrive':
      case 'oned':
        return Database;
      case 'saurajcf':
        return HardDrive;
      default:
        return Database;
    }
  };

  const getRemoteName = (remote: string) => {
    switch (remote) {
      case 'hakimionedrive':
        return 'Hakimi OneDrive';
      case 'oned':
        return 'OneDrive Primary';
      case 'saurajcf':
        return 'Sauraj CloudFlare';
      default:
        return remote;
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '[&>div]:bg-error';
    if (percentage >= 70) return '[&>div]:bg-warning';
    return '[&>div]:bg-success';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return AlertTriangle;
    return CheckCircle2;
  };

  if (error) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-error" />
          <p className="text-sm font-medium text-error">Storage Offline</p>
        </div>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground animate-pulse" />
          <p className="text-sm font-medium">Loading storage data...</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded animate-pulse w-20"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
              </div>
              <div className="h-2 bg-muted rounded animate-pulse"></div>
              <div className="flex justify-between">
                <div className="h-2 bg-muted rounded animate-pulse w-12"></div>
                <div className="h-2 bg-muted rounded animate-pulse w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!quotaData) return null;

  // Calculate total across all remotes
  const totalUsed = Object.values(quotaData).reduce((acc, quota) => {
    return acc + parseFloat(quota.used.split(" ")[0]);
  }, 0);

  const totalAvailable = Object.values(quotaData).reduce((acc, quota) => {
    return acc + parseFloat(quota.total.split(" ")[0]);
  }, 0);

  const overallPercentage = (totalUsed / totalAvailable) * 100;

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-success" />
          <p className="text-sm font-medium">Storage Online</p>
        </div>
        <div className="flex items-center gap-1">
          {React.createElement(getStatusIcon(overallPercentage), { 
            className: `h-3 w-3 ${getStatusColor(overallPercentage)}` 
          })}
          <span className="text-xs text-muted-foreground">
            {overallPercentage.toFixed(1)}% used
          </span>
        </div>
      </div>

      {/* Individual Storage Backends */}
      <div className="space-y-4">
        {Object.entries(quotaData).map(([remote, quota]) => {
          const percentage = calculatePercentage(quota.used, quota.total);
          const StorageIcon = getStorageIcon(remote);
          const StatusIcon = getStatusIcon(percentage);
          
          return (
            <div key={remote} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StorageIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{getRemoteName(remote)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StatusIcon className={`h-3 w-3 ${getStatusColor(percentage)}`} />
                  <span className="text-xs text-muted-foreground">
                    {quota.used} / {quota.total}
                  </span>
                </div>
              </div>
              
              <Progress 
                value={percentage} 
                className={`h-1.5 bg-muted ${getProgressColor(percentage)}`}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Available: {quota.remaining}</span>
                <span>Cleaned: {quota.deleted}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Storage Policy Notice */}
      <div className="pt-3 border-t border-border">
        <div className="space-y-2">
          <p className="text-xs font-medium">Storage Policy:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Automatic cleanup at 90% capacity</li>
            <li>• Files stored on best-effort basis</li>
            <li>• Contact maintainers for file deletion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}