
import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import ProcessList from '@/components/ProcessList';
import ResourceMonitor from '@/components/ResourceMonitor';
import Charts from '@/components/Charts';
import { useProcesses, useSystemResources } from '@/lib/mockData';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { processes, killProcess, suspendProcess, resumeProcess, changePriority } = useProcesses();
  const { resources, history } = useSystemResources();

  // Filter processes based on search query
  const filteredProcesses = processes.filter(process => 
    process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    process.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    process.pid.toString().includes(searchQuery)
  );

  // Handler for search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Force refresh - this is just a mock for UI demonstration
  const handleRefresh = useCallback(() => {
    // In a real app, this would trigger a refresh of process data
    // For our mockup, we'll just show a toast message
    const toast = document.querySelector('#sonner');
    if (toast) {
      // @ts-ignore
      toast.__SONNER?.toast({
        title: "Refreshed",
        description: "Process data has been updated",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-[1600px] mx-auto px-4 py-6 page-transition">
        <Header onRefresh={handleRefresh} onSearch={handleSearch} />
        
        <ResourceMonitor resources={resources} />
        
        <Charts history={history} />
        
        <ProcessList 
          processes={filteredProcesses}
          onKill={killProcess}
          onSuspend={suspendProcess}
          onResume={resumeProcess}
          onPriorityChange={changePriority}
        />
      </div>
    </div>
  );
};

export default Index;
