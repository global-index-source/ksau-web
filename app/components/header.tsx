"use client";

import { Terminal, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface SystemStatus {
  status: 'healthy' | 'warning' | 'error';
  uptime?: string;
}

export function Header() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({ status: 'healthy' });

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch('/api/system');
        if (response.ok) {
          setSystemStatus({ status: 'healthy' });
        } else {
          setSystemStatus({ status: 'warning' });
        }
      } catch (error) {
        setSystemStatus({ status: 'error' });
      }
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Terminal className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">Ksau Web</h1>
            <p className="text-xs text-muted-foreground">Developer File Sharing</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs">
            <Activity className={`h-3 w-3 ${getStatusColor(systemStatus.status)}`} />
            <span className="text-muted-foreground">
              System {systemStatus.status}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}