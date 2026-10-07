import React from 'react';
import { 
  Car, 
  MapPin, 
  Database, 
  Ticket, 
  Radio, 
  Code2, 
  Sparkles,
  RefreshCw,
  Zap,
  SlidersHorizontal
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'nearMe' | 'floorMap' | 'reservations' | 'sensors' | 'mysql';
  setActiveTab: (tab: 'nearMe' | 'floorMap' | 'reservations' | 'sensors' | 'mysql') => void;
  activeReservationsCount: number;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  onOpenCodeModal: () => void;
  onExportSql: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeReservationsCount,
  isSimulating,
  setIsSimulating,
  onOpenCodeModal,
  onExportSql
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Car className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ParkPulse
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  MySQL 8.0 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Smart Parking & IoT Telemetry System • Coimbatore, Tamil Nadu
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('nearMe')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'nearMe'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Nearby Lots
            </button>

            <button
              onClick={() => setActiveTab('floorMap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'floorMap'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              Floor Map
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'reservations'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              Passes
              {activeReservationsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  {activeReservationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sensors')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sensors'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              IoT Sensors
            </button>

            <button
              onClick={() => setActiveTab('mysql')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'mysql'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              MySQL Studio
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live traffic simulator toggle */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              title="Toggle simulated IoT sensor pings and realistic car traffic in real time"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isSimulating
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="hidden sm:inline">Traffic Sim</span>
              <span className="sm:hidden">Sim</span>
              <span className={`text-[10px] font-bold px-1 rounded ${isSimulating ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800'}`}>
                {isSimulating ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* MySQL Export button */}
            <button
              onClick={onExportSql}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 transition-all shadow-sm"
              title="Export complete schema.sql with CREATE TABLE, TRIGGERS and SEED DATA"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Export .SQL
            </button>

            {/* Architecture / Source Spec button */}
            <button
              onClick={onOpenCodeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700 text-slate-200 transition-all shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">HTML/CSS/MySQL Spec</span>
              <span className="sm:hidden">Spec</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('nearMe')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'nearMe' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Near Me</span>
          </button>
          <button
            onClick={() => setActiveTab('floorMap')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'floorMap' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <Car className="w-4 h-4" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex flex-col items-center gap-1 py-1 px-2 relative ${activeTab === 'reservations' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <Ticket className="w-4 h-4" />
            <span>Passes</span>
            {activeReservationsCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'sensors' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <Radio className="w-4 h-4" />
            <span>Sensors</span>
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'mysql' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            <Database className="w-4 h-4" />
            <span>MySQL</span>
          </button>
        </div>
      </div>
    </header>
  );
};
