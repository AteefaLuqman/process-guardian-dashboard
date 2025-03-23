
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceHistory } from '@/lib/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface ChartsProps {
  history: ResourceHistory[];
}

const formatTime = (time: Date): string => {
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-2 border-none text-xs">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Charts: React.FC<ChartsProps> = ({ history }) => {
  // Format data for charts
  const chartData = history.map(item => ({
    time: formatTime(item.time),
    cpu: item.cpu,
    memory: item.memory,
    disk: item.disk
  }));

  return (
    <div className="glass-panel p-4 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-lg font-medium mb-2">System Resource History</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="cpu" 
              stroke="#3B82F6" 
              fillOpacity={1}
              fill="url(#colorCpu)" 
              name="CPU"
            />
            <Area 
              type="monotone" 
              dataKey="memory" 
              stroke="#10B981" 
              fillOpacity={1}
              fill="url(#colorMemory)" 
              name="Memory"
            />
            <Area 
              type="monotone" 
              dataKey="disk" 
              stroke="#6366F1" 
              fillOpacity={1}
              fill="url(#colorDisk)" 
              name="Disk I/O"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
            <span>CPU Usage</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
            <span>Memory Usage</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-indigo-500 mr-1"></div>
            <span>Disk I/O</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
