
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Settings, Search } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="w-full glass-panel mb-6 animate-slide-down">
      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <RefreshCcw size={16} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Process Guardian</h1>
            <p className="text-xs text-muted-foreground">
              Real-time system monitoring
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search processes..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button size="sm" variant="ghost">
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
