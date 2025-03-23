import { useState, useEffect } from 'react';

// Process type definition
export interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user: string;
  status: 'running' | 'sleeping' | 'stopped' | 'zombie';
  priority: number;
  time: string;
}

// System resources type definition
export interface SystemResources {
  cpu: {
    total: number;
    cores: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    read: number;
    write: number;
  };
  network?: {
    received: number;
    sent: number;
  };
}

// System history (for charts)
export interface ResourceHistory {
  time: Date;
  cpu: number;
  memory: number;
  disk: number;
}

// Generate random processes
const generateProcesses = (count: number): Process[] => {
  const users = ['system', 'user', 'admin', 'service'];
  const statuses: ('running' | 'sleeping' | 'stopped' | 'zombie')[] = ['running', 'sleeping', 'stopped', 'zombie'];
  const processes: Process[] = [];
  
  const processNames = [
    'chrome', 'firefox', 'safari', 'terminal', 'vscode', 
    'node', 'python', 'java', 'nginx', 'apache', 
    'mongodb', 'postgres', 'redis', 'mysql', 'docker',
    'spotify', 'slack', 'discord', 'skype', 'zoom',
    'systemd', 'kernel', 'init', 'bash', 'zsh',
    'finder', 'explorer', 'photoshop', 'illustrator', 'blender'
  ];
  
  for (let i = 0; i < count; i++) {
    processes.push({
      pid: Math.floor(Math.random() * 10000) + 1,
      name: processNames[Math.floor(Math.random() * processNames.length)],
      cpu: parseFloat((Math.random() * 15).toFixed(1)),
      memory: parseFloat((Math.random() * 500).toFixed(1)),
      user: users[Math.floor(Math.random() * users.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: Math.floor(Math.random() * 20) - 10,
      time: `${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    });
  }
  
  return processes;
};

// Generate random system resources data
const generateSystemResources = (): SystemResources => {
  const cpuTotal = parseFloat((Math.random() * 100).toFixed(1));
  const cores = Array.from({ length: 8 }, () => parseFloat((Math.random() * 100).toFixed(1)));
  const memoryTotal = 16384; // 16 GB in MB
  const memoryUsed = parseFloat((Math.random() * memoryTotal).toFixed(1));
  
  return {
    cpu: {
      total: cpuTotal,
      cores
    },
    memory: {
      total: memoryTotal,
      used: memoryUsed,
      free: memoryTotal - memoryUsed
    },
    disk: {
      read: parseFloat((Math.random() * 100).toFixed(1)),
      write: parseFloat((Math.random() * 100).toFixed(1))
    },
    network: {
      received: parseFloat((Math.random() * 10).toFixed(1)),
      sent: parseFloat((Math.random() * 5).toFixed(1))
    }
  };
};

// Generate initial history data for charts
const generateInitialHistory = (): ResourceHistory[] => {
  const now = new Date();
  const history: ResourceHistory[] = [];
  
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000); // 5 second intervals
    history.push({
      time,
      cpu: parseFloat((Math.random() * 100).toFixed(1)),
      memory: parseFloat((Math.random() * 80).toFixed(1)),
      disk: parseFloat((Math.random() * 50).toFixed(1))
    });
  }
  
  return history;
};

// Hook for processes data
export const useProcesses = (refreshInterval = 2000) => {
  const [processes, setProcesses] = useState<Process[]>(generateProcesses(25));
  
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedProcesses = processes.map(process => ({
        ...process,
        cpu: parseFloat((Math.max(0.1, Math.min(100, process.cpu + (Math.random() * 6) - 3))).toFixed(1)),
        memory: parseFloat((Math.max(0.1, Math.min(1000, process.memory + (Math.random() * 20) - 10))).toFixed(1)),
      }));
      setProcesses(updatedProcesses);
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [processes, refreshInterval]);
  
  const killProcess = (pid: number) => {
    setProcesses(processes.filter(process => process.pid !== pid));
  };
  
  const suspendProcess = (pid: number) => {
    setProcesses(processes.map(process => 
      process.pid === pid ? { ...process, status: 'stopped' } : process
    ));
  };
  
  const resumeProcess = (pid: number) => {
    setProcesses(processes.map(process => 
      process.pid === pid ? { ...process, status: 'running' } : process
    ));
  };
  
  const changePriority = (pid: number, priority: number) => {
    setProcesses(processes.map(process => 
      process.pid === pid ? { ...process, priority } : process
    ));
  };
  
  return { 
    processes, 
    killProcess, 
    suspendProcess, 
    resumeProcess, 
    changePriority 
  };
};

// Hook for system resources data
export const useSystemResources = (refreshInterval = 1000) => {
  const [resources, setResources] = useState<SystemResources>(generateSystemResources());
  const [history, setHistory] = useState<ResourceHistory[]>(generateInitialHistory());
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Update current resources
      const newResources = {
        cpu: {
          total: parseFloat((Math.max(0.1, Math.min(100, resources.cpu.total + (Math.random() * 10) - 5))).toFixed(1)),
          cores: resources.cpu.cores.map(core => 
            parseFloat((Math.max(0.1, Math.min(100, core + (Math.random() * 15) - 7.5))).toFixed(1))
          )
        },
        memory: {
          ...resources.memory,
          used: parseFloat((Math.max(0.1, Math.min(resources.memory.total, resources.memory.used + (Math.random() * 500) - 250))).toFixed(1)),
        },
        disk: {
          read: parseFloat((Math.max(0.1, Math.min(200, resources.disk.read + (Math.random() * 15) - 7.5))).toFixed(1)),
          write: parseFloat((Math.max(0.1, Math.min(200, resources.disk.write + (Math.random() * 15) - 7.5))).toFixed(1)),
        },
        network: {
          received: parseFloat((Math.max(0.1, Math.min(20, (resources.network?.received || 0) + (Math.random() * 2) - 1))).toFixed(1)),
          sent: parseFloat((Math.max(0.1, Math.min(10, (resources.network?.sent || 0) + (Math.random() * 1) - 0.5))).toFixed(1)),
        }
      };
      
      setResources(newResources);
      
      // Update history for charts
      const now = new Date();
      const newHistory = [...history, {
        time: now,
        cpu: newResources.cpu.total,
        memory: (newResources.memory.used / newResources.memory.total) * 100,
        disk: (newResources.disk.read + newResources.disk.write) / 2
      }];
      
      // Keep last 60 data points (5 minutes at 5s intervals)
      if (newHistory.length > 60) {
        newHistory.shift();
      }
      
      setHistory(newHistory);
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [resources, history, refreshInterval]);
  
  return { resources, history };
};
