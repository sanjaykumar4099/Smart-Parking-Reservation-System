import React, { useState } from 'react';
import { 
  ParkingLot, 
  UserLocation, 
  ParkingSpot, 
  Floor 
} from '../types';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Zap, 
  Accessibility, 
  ShieldCheck, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  Database
} from 'lucide-react';
import { USER_LOCATIONS_PRESETS } from '../data/initialData';

interface SpotFinderProps {
  lots: ParkingLot[];
  floors: Floor[];
  spots: ParkingSpot[];
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  onSelectLot: (lotId: number) => void;
  onQuickReserve: (lotId: number) => void;
  onRunSqlForLot?: (lotId: number) => void;
}

export const SpotFinder: React.FC<SpotFinderProps> = ({
  lots,
  floors,
  spots,
  userLocation,
  setUserLocation,
  onSelectLot,
  onQuickReserve,
  onRunSqlForLot
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ev' | 'accessible' | 'vip'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'availability' | 'rating'>('distance');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10);
  const [isLocating, setIsLocating] = useState(false);

  // Handle browser native geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          name: 'My Device Location (GPS)',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4))
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        // Fallback gracefully
        setUserLocation({
          name: 'Downtown Core (Simulated GPS)',
          lat: 37.7890,
          lng: -122.4010
        });
      },
      { timeout: 7000 }
    );
  };

  // Filter lots
  const filteredLots = lots
    .filter((lot) => {
      const matchesSearch =
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.city.toLowerCase().includes(searchQuery.toLowerCase());

      const distanceOk = (lot.distanceKm ?? 0) <= maxDistanceKm;

      if (!matchesSearch || !distanceOk) return false;

      if (filterType === 'ev') {
        return lot.evSpots > 0;
      }
      if (filterType === 'accessible') {
        return lot.accessibleSpots > 0;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceKm ?? 99) - (b.distanceKm ?? 99);
      }
      if (sortBy === 'price') {
        return a.hourlyRate - b.hourlyRate;
      }
      if (sortBy === 'availability') {
        return b.availableSpots - a.availableSpots;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  // Calculate live global stats
  const totalFreeSpots = spots.filter(s => s.isAvailable).length;
  const totalFreeEvSpots = spots.filter(s => s.isAvailable && s.spotType === 'ev').length;
  const totalFreeAccessible = spots.filter(s => s.isAvailable && s.spotType === 'accessible').length;

  return (
    <div className="space-y-6">
      {/* Hero & Geolocation Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live IoT Ultrasonic Sensor Stream • Coimbatore, TN
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Smart Parking in Coimbatore
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Track live spot availability across Peelamedu, Gandhipuram, RS Puram, and Coimbatore Junction with real-time MySQL tracking, FASTag/UPI integration, and EV charging.
            </p>
          </div>

          {/* User Location Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Current Location</span>
                <span className="font-semibold text-slate-200 truncate max-w-[170px]">
                  {userLocation.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <select
                aria-label="Preset Location"
                value={userLocation.name}
                onChange={(e) => {
                  const preset = USER_LOCATIONS_PRESETS.find(p => p.name === e.target.value);
                  if (preset) setUserLocation(preset);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-emerald-500"
              >
                {USER_LOCATIONS_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all shrink-0"
                title="Detect GPS from browser"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'GPS'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time stats counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Free Spots (All Lots)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{totalFreeSpots}</span>
              <span className="text-xs text-slate-500">/ {spots.length} total</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> EV Superchargers
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-cyan-400">{totalFreeEvSpots}</span>
              <span className="text-xs text-slate-500">ready</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Accessibility className="w-3 h-3 text-amber-400" /> Accessible Bays
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400">{totalFreeAccessible}</span>
              <span className="text-xs text-slate-500">available</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" /> MySQL State
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-slate-200">Synchronized</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by lot name, address, or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Spot Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => setFilterType('ev')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              filterType === 'ev'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-300" />
            EV Chargers
          </button>
          <button
            onClick={() => setFilterType('accessible')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              filterType === 'accessible'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5 text-amber-300" />
            Accessible
          </button>
        </div>

        {/* Sort & Distance */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <select
            aria-label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none"
          >
            <option value="distance">Sort: Nearest</option>
            <option value="availability">Sort: Most Available</option>
            <option value="price">Sort: Lowest Price</option>
            <option value="rating">Sort: Top Rated</option>
          </select>
        </div>
      </div>

      {/* Nearby Lots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredLots.map((lot) => {
          const lotFloors = floors.filter(f => f.lotId === lot.id);
          const lotSpots = spots.filter(s => s.lotId === lot.id);
          const availableCount = lotSpots.filter(s => s.isAvailable).length;
          const availableEv = lotSpots.filter(s => s.isAvailable && s.spotType === 'ev').length;
          const percentFree = Math.round((availableCount / lot.totalSpots) * 100);

          // Estimated drive time based on distance (approx 20 km/h in city traffic)
          const driveMinutes = Math.max(1, Math.round(((lot.distanceKm ?? 0.5) / 20) * 60));

          return (
            <div
              key={lot.id}
              className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-4">
                {/* Header: Name, Distance & Price */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {lot.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        ★ {lot.rating} ({lot.reviewsCount})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {lot.address}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-extrabold text-emerald-400">
                      ₹{lot.hourlyRate.toFixed(0)}
                      <span className="text-xs font-normal text-slate-400">/hr</span>
                    </div>
                    <div className="text-[11px] font-semibold text-cyan-400 flex items-center justify-end gap-1">
                      <Navigation className="w-3 h-3" />
                      {lot.distanceKm} km ({driveMinutes} min)
                    </div>
                  </div>
                </div>

                {/* Live Availability Bar */}
                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${availableCount > 5 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      Real-Time Spot Availability
                    </span>
                    <span className="font-bold text-slate-200">
                      <span className={availableCount > 10 ? 'text-emerald-400' : 'text-amber-400'}>
                        {availableCount}
                      </span>{' '}
                      / {lot.totalSpots} Free ({percentFree}%)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentFree > 40
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : percentFree > 15
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-rose-500 to-red-400'
                      }`}
                      style={{ width: `${percentFree}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>EV Chargers: <strong className="text-cyan-300">{availableEv} free</strong></span>
                    <span>Entrance: <strong className="text-slate-300">{lot.entranceLane}</strong></span>
                  </div>
                </div>

                {/* Amenities & Floors breakdown */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {lot.operatingHours}
                    </span>
                    {lot.hasCctv && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> CCTV Monitored
                      </span>
                    )}
                    {lot.hasCoveredRoof && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        Covered Deck
                      </span>
                    )}
                  </div>

                  {/* Floor tags */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 overflow-x-auto">
                    <Layers className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>Floors:</span>
                    {lotFloors.map(f => {
                      const fSpots = lotSpots.filter(s => s.floorId === f.id);
                      const fAvail = fSpots.filter(s => s.isAvailable).length;
                      return (
                        <span key={f.id} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                          {f.levelCode}: <strong className="text-emerald-400">{fAvail}</strong>/{f.totalSpots}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {onRunSqlForLot && (
                  <button
                    onClick={() => onRunSqlForLot(lot.id)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-mono flex items-center gap-1"
                    title="Run MySQL query for this lot"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">SQL</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                  <button
                    onClick={() => onSelectLot(lot.id)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Interactive Floor Map
                  </button>

                  <button
                    onClick={() => onQuickReserve(lot.id)}
                    disabled={availableCount === 0}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                  >
                    <span>Reserve Spot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLots.length === 0 && (
        <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
          <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No parking garages found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, increasing distance radius, or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setMaxDistanceKm(10);
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
