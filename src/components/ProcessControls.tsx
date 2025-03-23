
import React from 'react';
import { Process } from '@/lib/mockData';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, Pause, Play, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from "sonner";

interface ProcessControlsProps {
  process: Process;
  onKill: (pid: number) => void;
  onSuspend: (pid: number) => void;
  onResume: (pid: number) => void;
  onPriorityChange: (pid: number, priority: number) => void;
  expanded?: boolean;
}

const ProcessControls: React.FC<ProcessControlsProps> = ({
  process,
  onKill,
  onSuspend,
  onResume,
  onPriorityChange,
  expanded = false
}) => {
  // Handler functions with toasts
  const handleKill = (e: React.MouseEvent) => {
    e.stopPropagation();
    onKill(process.pid);
    toast.success(`Process ${process.name} (${process.pid}) terminated`);
  };

  const handleSuspend = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSuspend(process.pid);
    toast.info(`Process ${process.name} (${process.pid}) suspended`);
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResume(process.pid);
    toast.info(`Process ${process.name} (${process.pid}) resumed`);
  };

  const handlePriorityChange = (newPriority: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onPriorityChange(process.pid, newPriority);
    toast.info(`Priority for ${process.name} changed to ${newPriority}`);
  };

  if (expanded) {
    return (
      <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
        {process.status === 'running' && (
          <Button size="sm" variant="outline" onClick={handleSuspend}>
            <Pause className="h-4 w-4 mr-1" /> Suspend
          </Button>
        )}
        {process.status !== 'running' && (
          <Button size="sm" variant="outline" onClick={handleResume}>
            <Play className="h-4 w-4 mr-1" /> Resume
          </Button>
        )}
        <Button size="sm" variant="destructive" onClick={handleKill}>
          <X className="h-4 w-4 mr-1" /> Terminate
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="secondary">
              Priority <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={(e) => handlePriorityChange(10, e)}>
              <ArrowUp className="h-4 w-4 mr-2" /> High (+10)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handlePriorityChange(5, e)}>
              <ArrowUp className="h-4 w-4 mr-2" /> Above Normal (+5)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handlePriorityChange(0, e)}>
              Normal (0)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handlePriorityChange(-5, e)}>
              <ArrowDown className="h-4 w-4 mr-2" /> Below Normal (-5)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handlePriorityChange(-10, e)}>
              <ArrowDown className="h-4 w-4 mr-2" /> Low (-10)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {process.status === 'running' ? (
            <DropdownMenuItem onClick={handleSuspend}>
              <Pause className="h-4 w-4 mr-2" /> Suspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleResume}>
              <Play className="h-4 w-4 mr-2" /> Resume
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleKill} className="text-destructive">
            <X className="h-4 w-4 mr-2" /> Terminate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => handlePriorityChange(process.priority + 1, e)}>
            <ArrowUp className="h-4 w-4 mr-2" /> Increase Priority
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handlePriorityChange(process.priority - 1, e)}>
            <ArrowDown className="h-4 w-4 mr-2" /> Decrease Priority
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProcessControls;
