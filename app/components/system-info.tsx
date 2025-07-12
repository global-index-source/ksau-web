"use client";

import { useEffect, useState } from 'react';
import React from 'react';
import { Activity, Cpu, HardDrive, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { config } from '../config';

interface SystemData {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    used_percent: number;
  };
}

export function SystemInfo() {
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setError(null);
        const response = await fetch('/api/system');
        const data = await response.json();
        if (data.status === 'success') {
          setSystemData(data.data);
        } else {
          setError('Failed to fetch system data');
        }
      } catch (error) {
        setError('Error connecting to system');
        console.error('Error fetching system info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)}GB`;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return AlertTriangle;
    return CheckCircle2;
  };

  if (error) return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-error" />
        <p className="text-sm font-medium text-error">System Offline</p>
      </div>
      <p className="text-xs text-muted-foreground">{error}</p>
    </div>
  );

  if (isLoading) return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded animate-pulse"></div>
        <div className="h-2 bg-muted rounded animate-pulse w-3/4"></div>
      </div>
    </div>
  );

  if (!systemData) return null;

  const cpuStatusIcon = getStatusIcon(systemData.cpu.usage);
  const memoryStatusIcon = getStatusIcon(systemData.memory.used_percent);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-success" />
        <p className="text-sm font-medium">System Online</p>
      </div>
      
      <div className="space-y-4">
        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">CPU Usage</span>
            </div>
            <div className="flex items-center gap-1">
              {React.createElement(cpuStatusIcon, { 
                className: `h-3 w-3 ${getStatusColor(systemData.cpu.usage)}` 
              })}
              <span className="text-xs text-muted-foreground">
                {systemData.cpu.usage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                systemData.cpu.usage >= 90 ? 'bg-error' :
                systemData.cpu.usage >= 70 ? 'bg-warning' :
                'bg-success'
              }`}
              style={{ width: `${Math.min(systemData.cpu.usage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {systemData.cpu.cores} cores available
          </p>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">Memory Usage</span>
            </div>
            <div className="flex items-center gap-1">
              {React.createElement(memoryStatusIcon, { 
                className: `h-3 w-3 ${getStatusColor(systemData.memory.used_percent)}` 
              })}
              <span className="text-xs text-muted-foreground">
                {systemData.memory.used_percent.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                systemData.memory.used_percent >= 90 ? 'bg-error' :
                systemData.memory.used_percent >= 70 ? 'bg-warning' :
                'bg-success'
              }`}
              style={{ width: `${Math.min(systemData.memory.used_percent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatBytes(systemData.memory.used)} / {formatBytes(systemData.memory.total)}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground italic">
          Running on minimal resources as a non-profit service. Please be patient with any delays.
        </p>
      </div>
    </div>
  );
}