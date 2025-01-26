"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await fetch('/api/quota');
        const data = await response.json();
        if (data.status === "success") {
          setQuotaData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch quota:", error);
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

  if (!quotaData) return null;

  return (
    <Card className="border-green-900 bg-black/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">{"{>}"} Storage Quota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(quotaData).map(([remote, quota]) => {
          const percentage = calculatePercentage(quota.used, quota.total);
          return (
            <div key={remote} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-400">{remote}</span>
                <span className="text-green-300">{quota.used} / {quota.total}</span>
              </div>
              <Progress 
                value={percentage} 
                className={`h-2 bg-green-950 [&>div]:${
                  percentage > 90 ? 'bg-red-500' :
                  percentage > 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
              />
              <div className="flex justify-between text-xs text-green-700">
                <span>Remaining: {quota.remaining}</span>
                <span>Deleted: {quota.deleted}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}