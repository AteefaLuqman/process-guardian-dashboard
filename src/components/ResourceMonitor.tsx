
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SystemResources } from '@/lib/mockData';
import { Cpu, Database, HardDrive, Network } from 'lucide-react';

interface ResourceMonitorProps {
  resources: SystemResources;
}

const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ resources }) => {
  // Format bytes to a readable format
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Calc memory percentage
  const memoryPercentage = (resources.memory.used / resources.memory.total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* CPU Usage */}
      <div className="stat-card animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-primary/10 mr-2">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">CPU Usage</h3>
          </div>
          <span className={`text-sm font-mono ${resources.cpu.total > 80 ? 'text-destructive' : ''}`}>
            {formatPercentage(resources.cpu.total)}
          </span>
        </div>
        <Progress 
          value={resources.cpu.total}
          className="h-2"
          indicatorClassName={resources.cpu.total > 80 ? 'bg-destructive' : ''}
        />
        <div className="mt-3 grid grid-cols-4 gap-1">
          {resources.cpu.cores.slice(0, 4).map((core, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-muted-foreground">Core {index + 1}</div>
              <div className="font-mono text-xs">{formatPercentage(core)}</div>
              <Progress value={core} className="h-1 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Memory Usage */}
      <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-primary/10 mr-2">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Memory</h3>
          </div>
          <span className={`text-sm font-mono ${memoryPercentage > 80 ? 'text-destructive' : ''}`}>
            {formatPercentage(memoryPercentage)}
          </span>
        </div>
        <Progress 
          value={memoryPercentage} 
          className="h-2"
          indicatorClassName={memoryPercentage > 80 ? 'bg-destructive' : ''}
        />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Used</div>
            <div className="font-mono text-sm">{formatBytes(resources.memory.used * 1024 * 1024)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="font-mono text-sm">{formatBytes(resources.memory.total * 1024 * 1024)}</div>
          </div>
        </div>
      </div>

      {/* Disk I/O */}
      <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-md bg-primary/10 mr-2">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Disk I/O</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div>
            <div className="text-xs text-muted-foreground">Read</div>
            <div className="font-mono text-sm">{resources.disk.read.toFixed(1)} MB/s</div>
            <Progress 
              value={Math.min(100, (resources.disk.read / 200) * 100)} 
              className="h-1 mt-1"
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Write</div>
            <div className="font-mono text-sm">{resources.disk.write.toFixed(1)} MB/s</div>
            <Progress 
              value={Math.min(100, (resources.disk.write / 200) * 100)} 
              className="h-1 mt-1"
            />
          </div>
        </div>
      </div>

      {/* Network */}
      <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-md bg-primary/10 mr-2">
            <Network className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Network</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div>
            <div className="text-xs text-muted-foreground">Received</div>
            <div className="font-mono text-sm">
              {resources.network?.received.toFixed(1)} MB/s
            </div>
            <Progress 
              value={Math.min(100, ((resources.network?.received || 0) / 20) * 100)} 
              className="h-1 mt-1"
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Sent</div>
            <div className="font-mono text-sm">
              {resources.network?.sent.toFixed(1)} MB/s
            </div>
            <Progress 
              value={Math.min(100, ((resources.network?.sent || 0) / 10) * 100)} 
              className="h-1 mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceMonitor;
