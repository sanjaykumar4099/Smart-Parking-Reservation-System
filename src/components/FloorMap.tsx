import React, { useState } from 'react';
import { ParkingLot, Floor, ParkingSpot, SpotType } from '../types';
import { 
  Car, 
  Zap, 
  Accessibility, 
  Crown, 
  ArrowUp, 
  ArrowDown, 
  DoorClosed, 
  CheckCircle, 
  Clock, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

interface FloorMapProps {
  lots: ParkingLot[];
  floors: Floor[];
  spots: ParkingSpot[];
  selectedLotId: number;
  setSelectedLotId: (id: number) => void;
  selectedFloorId: number;
  setSelectedFloorId: (id: number) => void;
  selectedSpot: ParkingSpot | null;
  setSelectedSpot: (spot: ParkingSpot | null) => void;
  onBookSpot: (spot: ParkingSpot) => void;
}

export const FloorMap: React.FC<FloorMapProps> = ({
  lots,
  floors,
  spots,
  selectedLotId,
  setSelectedLotId,
  selectedFloorId,
  setSelectedFloorId,
  selectedSpot,
  setSelectedSpot,
  onBookSpot
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const currentLot = lots.find(l => l.id === selectedLotId) || lots[0];
  const lotFloors = floors.filter(f => f.lotId === currentLot.id);
  const currentFloor = lotFloors.find(f => f.id === selectedFloorId) || lotFloors[0] || floors[0];

  const currentSpots = spots.filter(s => s.floorId === currentFloor?.id);
  const rowASpots = currentSpots.filter(s => s.rowLetter === 'A').sort((a, b) => a.columnNumber - b.columnNumber);
  const rowBSpots = currentSpots.filter(s => s.rowLetter === 'B').sort((a, b) => a.columnNumber - b.columnNumber);

  const availableSpotsCount = currentSpots.filter(s => s.isAvailable).length;

  const getSpotBadge = (type: SpotType) => {
    switch (type) {
      case 'ev':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'accessible':
        return <Accessibility className="w-3.5 h-3.5 text-amber-400" />;
      case 'vip':
        return <Crown className="w-3.5 h-3.5 text-purple-400" />;
      case 'motorcycle':
        return <span className="text-[10px] font-bold text-orange-400">MOTO</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Garage and Floor Switcher Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Interactive Garage Layout
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="text-xs text-slate-400 font-mono">
                {currentLot.entranceLane}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-0.5">
              {currentLot.name}
            </h2>
            <p className="text-xs text-slate-400">
              {currentLot.address} • Real-Time IoT Ultrasonic Node Status
            </p>
          </div>

          {/* Garage Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Garage:</span>
            <select
              aria-label="Select Parking Garage"
              value={selectedLotId}
              onChange={(e) => {
                const newLotId = Number(e.target.value);
                setSelectedLotId(newLotId);
                const firstFl = floors.find(f => f.lotId === newLotId);
                if (firstFl) setSelectedFloorId(firstFl.id);
                setSelectedSpot(null);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-emerald-500"
            >
              {lots.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} (₹{l.hourlyRate.toFixed(0)}/hr)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Floor Level Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-medium mr-1">Floor:</span>
            {lotFloors.map(floor => {
              const fSpots = spots.filter(s => s.floorId === floor.id);
              const free = fSpots.filter(s => s.isAvailable).length;
              const isActive = floor.id === currentFloor?.id;
              return (
                <button
                  key={floor.id}
                  onClick={() => {
                    setSelectedFloorId(floor.id);
                    setSelectedSpot(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{floor.floorName}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-emerald-400'
                  }`}>
                    {free} Free
                  </span>
                </button>
              );
            })}
          </div>

          {/* Spot Type Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Show:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              All ({currentSpots.length})
            </button>
            <button
              onClick={() => setFilterType('ev')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'ev' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              EV Chargers
            </button>
            <button
              onClick={() => setFilterType('available')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'available' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Available Only
            </button>
          </div>
        </div>
      </div>

      {/* Architectural Parking Deck Plan */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        {/* Legend */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border-2 border-emerald-500 inline-block shadow-sm shadow-emerald-500/30" />
              <span>Available (Click to Select)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-950 border-2 border-rose-600 inline-block" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-950 border-2 border-amber-500 inline-block" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-cyan-950 border-2 border-cyan-400 inline-block flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-cyan-400" />
              </span>
              <span>EV Charger (150kW/50kW)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Ultrasonic Mesh Active</span>
          </div>
        </div>

        {/* Layout Floor Structure */}
        <div className="relative z-10 space-y-6">
          {/* Top Entry / Exit Facilities Bar */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" /> ENTRY GATE A
              </span>
              <span className="text-slate-500">• Automated RFID & LPR Barrier</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono flex items-center gap-1">
                <DoorClosed className="w-3.5 h-3.5 text-cyan-400" /> ELEVATOR / STAIRS
              </span>

              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-400 font-mono font-bold flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5" /> EXIT RAMP
              </span>
            </div>
          </div>

          {/* Row A Parking Bays */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="font-bold text-slate-300">BAY ROW A (North Side)</span>
              <span>Head-In 90° Standard Bays</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-2.5">
              {rowASpots.map((spot) => {
                const isSelected = selectedSpot?.id === spot.id;
                const isDimmed = filterType === 'ev' && spot.spotType !== 'ev' ||
                                 filterType === 'available' && !spot.isAvailable;

                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      if (spot.isAvailable) {
                        setSelectedSpot(isSelected ? null : spot);
                      }
                    }}
                    disabled={!spot.isAvailable}
                    className={`relative flex flex-col items-center justify-between p-2 rounded-xl transition-all h-28 text-left border ${
                      isDimmed ? 'opacity-30' : ''
                    } ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 shadow-lg shadow-blue-500/30 scale-105 z-20'
                        : spot.isAvailable
                        ? 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-600/70 hover:border-emerald-400 cursor-pointer shadow-sm shadow-emerald-500/10'
                        : spot.status === 'occupied'
                        ? 'bg-rose-950/30 border-rose-800/80 cursor-not-allowed opacity-90'
                        : 'bg-amber-950/30 border-amber-800/80 cursor-not-allowed'
                    }`}
                  >
                    {/* Spot Number & Badge */}
                    <div className="w-full flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-200">
                        {spot.spotNumber}
                      </span>
                      {getSpotBadge(spot.spotType)}
                    </div>

                    {/* Bay Visual Representation */}
                    <div className="my-auto flex flex-col items-center justify-center">
                      {spot.status === 'occupied' ? (
                        <div className="flex flex-col items-center">
                          <Car className="w-7 h-7 text-rose-400 transform rotate-180" />
                          <span className="text-[9px] font-mono text-rose-300/80 mt-0.5 font-bold">
                            {spot.currentPlate || 'OCCUPIED'}
                          </span>
                        </div>
                      ) : spot.status === 'reserved' ? (
                        <div className="flex flex-col items-center">
                          <Clock className="w-6 h-6 text-amber-400" />
                          <span className="text-[9px] font-mono text-amber-300 font-bold mt-0.5">
                            RESERVED
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-blue-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 mt-1">
                            FREE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Rate & Sensor */}
                    <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/60 pt-1">
                      <span>₹{spot.hourlyRate}/h</span>
                      {spot.chargerType && spot.chargerType !== 'None' ? (
                        <span className="text-cyan-400 font-bold">⚡EV</span>
                      ) : (
                        <span className="text-[9px] text-slate-500">STD</span>
                      )}
                    </div>

                    {/* Ultrasonic pulse beacon for available spots */}
                    {spot.isAvailable && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Central Driving Lane */}
          <div className="relative py-4 px-6 bg-slate-900/90 rounded-2xl border border-dashed border-slate-700/80 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-300">
                DRIVEWAY MAIN AISLE
              </span>
              <div className="flex items-center gap-1 text-slate-500 font-mono text-xs">
                <span>SPEED LIMIT: 5 MPH</span>
              </div>
            </div>

            {/* Directional Arrows in Asphalt */}
            <div className="flex items-center gap-12 text-slate-600">
              <div className="flex items-center gap-1 font-mono text-xs text-emerald-500/80">
                <span>ONE WAY</span>
                <span className="text-base font-bold">➔➔➔</span>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              CLEARANCE: 7' 2" (2.2M)
            </div>
          </div>

          {/* Row B Parking Bays */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="font-bold text-slate-300">BAY ROW B (South Side)</span>
              <span>Back-In 90° Bays</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-2.5">
              {rowBSpots.map((spot) => {
                const isSelected = selectedSpot?.id === spot.id;
                const isDimmed = filterType === 'ev' && spot.spotType !== 'ev' ||
                                 filterType === 'available' && !spot.isAvailable;

                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      if (spot.isAvailable) {
                        setSelectedSpot(isSelected ? null : spot);
                      }
                    }}
                    disabled={!spot.isAvailable}
                    className={`relative flex flex-col items-center justify-between p-2 rounded-xl transition-all h-28 text-left border ${
                      isDimmed ? 'opacity-30' : ''
                    } ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 shadow-lg shadow-blue-500/30 scale-105 z-20'
                        : spot.isAvailable
                        ? 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-600/70 hover:border-emerald-400 cursor-pointer shadow-sm shadow-emerald-500/10'
                        : spot.status === 'occupied'
                        ? 'bg-rose-950/30 border-rose-800/80 cursor-not-allowed opacity-90'
                        : 'bg-amber-950/30 border-amber-800/80 cursor-not-allowed'
                    }`}
                  >
                    {/* Spot Number & Badge */}
                    <div className="w-full flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-200">
                        {spot.spotNumber}
                      </span>
                      {getSpotBadge(spot.spotType)}
                    </div>

                    {/* Bay Visual */}
                    <div className="my-auto flex flex-col items-center justify-center">
                      {spot.status === 'occupied' ? (
                        <div className="flex flex-col items-center">
                          <Car className="w-7 h-7 text-rose-400" />
                          <span className="text-[9px] font-mono text-rose-300/80 mt-0.5 font-bold">
                            {spot.currentPlate || 'OCCUPIED'}
                          </span>
                        </div>
                      ) : spot.status === 'reserved' ? (
                        <div className="flex flex-col items-center">
                          <Clock className="w-6 h-6 text-amber-400" />
                          <span className="text-[9px] font-mono text-amber-300 font-bold mt-0.5">
                            RESERVED
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-blue-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 mt-1">
                            FREE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Rate */}
                    <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/60 pt-1">
                      <span>₹{spot.hourlyRate}/h</span>
                      {spot.chargerType && spot.chargerType !== 'None' ? (
                        <span className="text-cyan-400 font-bold">⚡EV</span>
                      ) : (
                        <span className="text-[9px] text-slate-500">STD</span>
                      )}
                    </div>

                    {spot.isAvailable && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Spot Action Drawer */}
      {selectedSpot ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/80 border-2 border-blue-500/80 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400 flex flex-col items-center justify-center text-blue-200">
              <span className="text-[10px] uppercase font-mono font-bold">BAY</span>
              <span className="text-lg font-black text-white">{selectedSpot.spotNumber}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">
                  Spot {selectedSpot.spotNumber} Selected
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Ready to Reserve
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentLot.name} • {currentFloor.floorName} • Row {selectedSpot.rowLetter} Bay #{selectedSpot.columnNumber}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Rate: <strong className="text-emerald-400 font-bold">₹{selectedSpot.hourlyRate}/hr</strong></span>
                {selectedSpot.chargerType && selectedSpot.chargerType !== 'None' && (
                  <span className="text-cyan-300 font-semibold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> {selectedSpot.chargerType}
                  </span>
                )}
                <span>Sensor ID: <code className="text-slate-400">{selectedSpot.sensorId}</code></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setSelectedSpot(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Deselect
            </button>
            <button
              onClick={() => onBookSpot(selectedSpot)}
              className="flex-1 md:flex-initial px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Book Spot Now</span>
              <span className="text-[10px] bg-blue-800 px-1.5 py-0.5 rounded font-mono">SQL INSERT</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Click any <strong>green bay</strong> on the map above to select and reserve your parking spot.</span>
        </div>
      )}
    </div>
  );
};
