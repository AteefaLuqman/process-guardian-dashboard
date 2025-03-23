
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Process } from '@/lib/mockData';
import ProcessControls from './ProcessControls';
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProcessListProps {
  processes: Process[];
  onKill: (pid: number) => void;
  onSuspend: (pid: number) => void;
  onResume: (pid: number) => void;
  onPriorityChange: (pid: number, priority: number) => void;
}

type SortField = 'pid' | 'name' | 'cpu' | 'memory' | 'user' | 'status' | 'priority' | 'time';
type SortDirection = 'asc' | 'desc';

const ProcessList: React.FC<ProcessListProps> = ({ 
  processes, 
  onKill, 
  onSuspend, 
  onResume, 
  onPriorityChange 
}) => {
  const [sortField, setSortField] = useState<SortField>('cpu');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort processes
  const sortedProcesses = React.useMemo(() => {
    return [...processes].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Number comparison
      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number) 
        : (bValue as number) - (aValue as number);
    });
  }, [processes, sortField, sortDirection]);

  // Render sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4 inline" /> 
      : <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };

  // Status badge color
  const getStatusBadge = (status: Process['status']) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-500">Running</Badge>;
      case 'sleeping':
        return <Badge variant="outline" className="text-muted-foreground">Sleeping</Badge>;
      case 'stopped':
        return <Badge variant="secondary">Stopped</Badge>;
      case 'zombie':
        return <Badge variant="destructive">Zombie</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="glass-panel animate-slide-up">
      <Table>
        <TableCaption>Live process list - Updated in real-time</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[80px] cursor-pointer" 
              onClick={() => handleSort('pid')}
            >
              PID <SortIndicator field="pid" />
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('name')}
            >
              Process Name <SortIndicator field="name" />
            </TableHead>
            <TableHead 
              className="w-[100px] text-right cursor-pointer" 
              onClick={() => handleSort('cpu')}
            >
              CPU (%) <SortIndicator field="cpu" />
            </TableHead>
            <TableHead 
              className="w-[120px] text-right cursor-pointer" 
              onClick={() => handleSort('memory')}
            >
              Memory (MB) <SortIndicator field="memory" />
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('user')}
            >
              User <SortIndicator field="user" />
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Status <SortIndicator field="status" />
            </TableHead>
            <TableHead 
              className="text-center cursor-pointer"
              onClick={() => handleSort('priority')}
            >
              Priority <SortIndicator field="priority" />
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('time')}
            >
              Time <SortIndicator field="time" />
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProcesses.map((process) => (
            <React.Fragment key={process.pid}>
              <TableRow 
                className={`process-row ${expandedProcess === process.pid ? 'bg-secondary' : ''}`}
                onClick={() => setExpandedProcess(expandedProcess === process.pid ? null : process.pid)}
              >
                <TableCell className="font-mono">{process.pid}</TableCell>
                <TableCell className="font-medium">{process.name}</TableCell>
                <TableCell className="text-right font-mono animate-value-change">
                  {process.cpu.toFixed(1)}
                </TableCell>
                <TableCell className="text-right font-mono animate-value-change">
                  {process.memory.toFixed(1)}
                </TableCell>
                <TableCell>{process.user}</TableCell>
                <TableCell>{getStatusBadge(process.status)}</TableCell>
                <TableCell className="text-center font-mono">
                  {process.priority > 0 ? `+${process.priority}` : process.priority}
                </TableCell>
                <TableCell className="font-mono">{process.time}</TableCell>
                <TableCell className="text-right">
                  <ProcessControls 
                    process={process}
                    onKill={onKill}
                    onSuspend={onSuspend}
                    onResume={onResume}
                    onPriorityChange={onPriorityChange}
                  />
                </TableCell>
              </TableRow>
              {/* Expanded Row */}
              {expandedProcess === process.pid && (
                <TableRow className="bg-secondary/50">
                  <TableCell colSpan={9} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Process Details</h4>
                        <p className="text-xs text-muted-foreground mb-1">Full path: /usr/bin/{process.name}</p>
                        <p className="text-xs text-muted-foreground mb-1">Started: Today at 12:30 PM</p>
                        <p className="text-xs text-muted-foreground">Threads: {Math.floor(Math.random() * 20) + 1}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Resource Usage Trend</h4>
                        <div className="h-12 bg-background/50 rounded flex items-end">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div 
                              key={i}
                              className="w-full h-[30%] bg-primary/50 mx-0.5 rounded-t"
                              style={{ 
                                height: `${20 + Math.random() * 80}%`,
                                opacity: 0.3 + (i / 12) * 0.7
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Quick Actions</h4>
                        <ProcessControls 
                          process={process}
                          onKill={onKill}
                          onSuspend={onSuspend}
                          onResume={onResume}
                          onPriorityChange={onPriorityChange}
                          expanded
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcessList;
