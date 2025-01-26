"use client";

import { useEffect, useState } from 'react';
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
        const response = await fetch(`${config.apiEndpoint}${config.endpoints.system}`);
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

  if (error) return (
    <div className="pt-4 border-t border-green-900">
      <p className="text-xs text-red-500">{"{>}"} {error}</p>
    </div>
  );

  if (isLoading) return (
    <div className="pt-4 border-t border-green-900">
      <p className="text-xs text-green-500 animate-pulse">{"{>}"} Fetching system status...</p>
    </div>
  );

  if (!systemData) return null;

  return (
    <div className="pt-4 border-t border-green-900">
      <div className="space-y-3">
        <p className="text-sm text-green-400">{"{>}"} System Status:</p>
        <div className="space-y-2 text-xs text-green-300">
          <p>CPU Usage: {systemData.cpu.usage.toFixed(1)}% ({systemData.cpu.cores} cores)</p>
          <p>Memory: {formatBytes(systemData.memory.used)} / {formatBytes(systemData.memory.total)}</p>
          <p>Memory Load: {systemData.memory.used_percent.toFixed(1)}%</p>
          <p className="text-green-700 italic mt-2">
            {"{>}"} *Running on minimal resources as a non-profit service. Please be patient if you experience any delays.
          </p>
        </div>
      </div>
    </div>
  );
}