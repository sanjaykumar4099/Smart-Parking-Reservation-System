/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ParkingLot, 
  Floor, 
  ParkingSpot, 
  Reservation, 
  SpotSensor, 
  UserLocation 
} from './types';
import { 
  INITIAL_PARKING_LOTS, 
  INITIAL_FLOORS, 
  generateInitialSpotsAndSensors, 
  INITIAL_RESERVATIONS, 
  USER_LOCATIONS_PRESETS,
  calculateDistanceKm 
} from './data/initialData';
import { mySqlEngine } from './services/mysqlEngine';
import { Navbar } from './components/Navbar';
import { SpotFinder } from './components/SpotFinder';
import { FloorMap } from './components/FloorMap';
import { BookingModal } from './components/BookingModal';
import { TicketPassModal } from './components/TicketPassModal';
import { ActiveReservations } from './components/ActiveReservations';
import { MySqlConsole } from './components/MySqlConsole';
import { SensorMonitor } from './components/SensorMonitor';
import { CodeArchitectureModal } from './components/CodeArchitectureModal';

export default function App() {
  // Core state
  const [userLocation, setUserLocation] = useState<UserLocation>(USER_LOCATIONS_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'nearMe' | 'floorMap' | 'reservations' | 'sensors' | 'mysql'>('nearMe');
  
  // Data state
  const [lots, setLots] = useState<ParkingLot[]>(() => {
    return INITIAL_PARKING_LOTS.map(lot => ({
      ...lot,
      distanceKm: calculateDistanceKm(
        USER_LOCATIONS_PRESETS[0].lat,
        USER_LOCATIONS_PRESETS[0].lng,
        lot.lat,
        lot.lng
      )
    }));
  });

  const [floors, setFloors] = useState<Floor[]>(INITIAL_FLOORS);
  
  const [spotsAndSensors] = useState(() => generateInitialSpotsAndSensors());
  const [spots, setSpots] = useState<ParkingSpot[]>(spotsAndSensors.spots);
  const [sensors, setSensors] = useState<SpotSensor[]>(spotsAndSensors.sensors);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);

  // Selection states
  const [selectedLotId, setSelectedLotId] = useState<number>(1);
  const [selectedFloorId, setSelectedFloorId] = useState<number>(101);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  // Modals
  const [bookingSpot, setBookingSpot] = useState<ParkingSpot | null>(null);
  const [viewingPass, setViewingPass] = useState<Reservation | null>(null);
  const [codeModalOpen, setCodeModalOpen] = useState<boolean>(false);
  const [sqlPreQuery, setSqlPreQuery] = useState<string>('SELECT * FROM v_live_available_spots;');

  // Real-time Traffic Simulator Toggle
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  // Sync state to in-memory MySQL engine whenever relevant datasets change
  useEffect(() => {
    mySqlEngine.syncFromAppState(lots, floors, spots, reservations, sensors);
  }, [lots, floors, spots, reservations, sensors]);

  // Recalculate distance to lots when userLocation changes
  useEffect(() => {
    setLots(prevLots =>
      prevLots.map(lot => ({
        ...lot,
        distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, lot.lat, lot.lng)
      }))
    );
  }, [userLocation]);

  // Sync lot available count based on spot changes
  const refreshLotAvailability = useCallback((currentSpots: ParkingSpot[]) => {
    setLots(prevLots =>
      prevLots.map(lot => {
        const freeSpots = currentSpots.filter(s => s.lotId === lot.id && s.isAvailable).length;
        const freeEv = currentSpots.filter(s => s.lotId === lot.id && s.isAvailable && s.spotType === 'ev').length;
        return {
          ...lot,
          availableSpots: freeSpots,
          evSpots: freeEv
        };
      })
    );
  }, []);

  // Real-Time IoT Sensor Simulation (Occasional random traffic arrivals/departures)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick a random spot that is not reserved
      setSpots(prevSpots => {
        const candidates = prevSpots.filter(s => s.status !== 'reserved');
        if (candidates.length === 0) return prevSpots;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const willOccupied = target.isAvailable; // toggle
        const newStatus: ParkingSpot['status'] = willOccupied ? 'occupied' : 'available';

        const updated = prevSpots.map(s => {
          if (s.id === target.id) {
            return {
              ...s,
              status: newStatus,
              isAvailable: !willOccupied,
              currentPlate: willOccupied ? `TN-38-BZ-${Math.floor(1000 + Math.random() * 8999)}` : undefined,
              lastUpdated: new Date().toISOString()
            };
          }
          return s;
        });

        // Also update corresponding sensor
        setSensors(prevSensors =>
          prevSensors.map(sen => {
            if (sen.spotId === target.id) {
              return {
                ...sen,
                detectedDistanceCm: willOccupied ? Math.floor(40 + Math.random() * 25) : 240,
                lastPingTime: new Date().toISOString()
              };
            }
            return sen;
          })
        );

        // Toast feedback
        const msg = willOccupied
          ? `Sensor Ping: Bay ${target.spotNumber} occupied by vehicle`
          : `Sensor Ping: Bay ${target.spotNumber} vacated (now available)`;
        setSimulationToast(msg);
        setTimeout(() => setSimulationToast(null), 3500);

        refreshLotAvailability(updated);
        return updated;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isSimulating, refreshLotAvailability]);

  // Handle spot booking confirmation
  const handleConfirmBooking = (newReservation: Reservation) => {
    // 1. Update spot status in state
    const updatedSpots = spots.map(s => {
      if (s.id === newReservation.spotId) {
        return {
          ...s,
          status: 'reserved' as const,
          isAvailable: false,
          reservationId: newReservation.id,
          lastUpdated: new Date().toISOString()
        };
      }
      return s;
    });

    setSpots(updatedSpots);
    refreshLotAvailability(updatedSpots);

    // 2. Add to reservations
    setReservations(prev => [newReservation, ...prev]);

    // 3. Clear modal & selected spot
    setBookingSpot(null);
    setSelectedSpot(null);

    // 4. Show Digital Ticket Pass modal
    setViewingPass(newReservation);
  };

  // Check-In
  const handleCheckIn = (resId: string) => {
    setReservations(prev =>
      prev.map(r => (r.id === resId ? { ...r, checkInTime: new Date().toISOString() } : r))
    );
  };

  // Check-Out (Free the spot)
  const handleCheckOut = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setReservations(prev =>
      prev.map(r => (r.id === resId ? { ...r, status: 'completed' as const, checkOutTime: new Date().toISOString() } : r))
    );

    const updatedSpots = spots.map(s => {
      if (s.id === res.spotId) {
        return {
          ...s,
          status: 'available' as const,
          isAvailable: true,
          reservationId: undefined,
          lastUpdated: new Date().toISOString()
        };
      }
      return s;
    });

    setSpots(updatedSpots);
    refreshLotAvailability(updatedSpots);

    setSimulationToast(`Check-Out processed: Bay ${res.spotNumber} released and available for booking.`);
    setTimeout(() => setSimulationToast(null), 3500);
  };

  // Cancel reservation
  const handleCancelReservation = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setReservations(prev =>
      prev.map(r => (r.id === resId ? { ...r, status: 'cancelled' as const } : r))
    );

    const updatedSpots = spots.map(s => {
      if (s.id === res.spotId) {
        return {
          ...s,
          status: 'available' as const,
          isAvailable: true,
          reservationId: undefined,
          lastUpdated: new Date().toISOString()
        };
      }
      return s;
    });

    setSpots(updatedSpots);
    refreshLotAvailability(updatedSpots);
  };

  // Extend duration by 1 hour
  const handleExtendTime = (resId: string) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === resId) {
          const currentEnd = new Date(r.endTime).getTime();
          const newEnd = new Date(currentEnd + 60 * 60 * 1000).toISOString();
          const newDur = r.durationHours + 1;
          const addedFee = r.hourlyRate * 1.18; // 18% GST
          return {
            ...r,
            endTime: newEnd,
            durationHours: newDur,
            totalAmount: Number((r.totalAmount + addedFee).toFixed(2))
          };
        }
        return r;
      })
    );
    setSimulationToast(`Pass extended by +1 Hour.`);
    setTimeout(() => setSimulationToast(null), 3000);
  };

  // Manual Trigger Ultrasonic Sensor Ping
  const handleTriggerPing = (sensorId: string, distanceCm: number) => {
    const isCarPresent = distanceCm < 80;

    setSensors(prev =>
      prev.map(sen => {
        if (sen.sensorId === sensorId) {
          return {
            ...sen,
            detectedDistanceCm: distanceCm,
            lastPingTime: new Date().toISOString()
          };
        }
        return sen;
      })
    );

    const targetSensor = sensors.find(s => s.sensorId === sensorId);
    if (targetSensor) {
      const updatedSpots = spots.map(s => {
        if (s.id === targetSensor.spotId && s.status !== 'reserved') {
          return {
            ...s,
            status: isCarPresent ? ('occupied' as const) : ('available' as const),
            isAvailable: !isCarPresent,
            lastUpdated: new Date().toISOString()
          };
        }
        return s;
      });
      setSpots(updatedSpots);
      refreshLotAvailability(updatedSpots);
    }
  };

  // Export SQL handler
  const handleExportSql = () => {
    const dump = mySqlEngine.generateFullSqlDump();
    const blob = new Blob([dump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart_parking.sql';
    a.click();
  };

  // Quick reserve from Nearby list
  const handleQuickReserve = (lotId: number) => {
    setSelectedLotId(lotId);
    const lotSpots = spots.filter(s => s.lotId === lotId && s.isAvailable);
    if (lotSpots.length > 0) {
      setBookingSpot(lotSpots[0]);
    } else {
      setActiveTab('floorMap');
    }
  };

  // Run SQL for lot
  const handleRunSqlForLot = (lotId: number) => {
    setSqlPreQuery(`SELECT s.spot_number, s.spot_type, s.is_available, s.hourly_rate FROM parking_spots s WHERE s.lot_id = ${lotId};`);
    setActiveTab('mysql');
  };

  const activeReservationsCount = useMemo(() => {
    return reservations.filter(r => r.status === 'active').length;
  }, [reservations]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Simulation Toast Notification */}
      {simulationToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/80 text-emerald-300 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-mono">{simulationToast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeReservationsCount={activeReservationsCount}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        onOpenCodeModal={() => setCodeModalOpen(true)}
        onExportSql={handleExportSql}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'nearMe' && (
          <SpotFinder
            lots={lots}
            floors={floors}
            spots={spots}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            onSelectLot={(lotId) => {
              setSelectedLotId(lotId);
              const firstFl = floors.find(f => f.lotId === lotId);
              if (firstFl) setSelectedFloorId(firstFl.id);
              setActiveTab('floorMap');
            }}
            onQuickReserve={handleQuickReserve}
            onRunSqlForLot={handleRunSqlForLot}
          />
        )}

        {activeTab === 'floorMap' && (
          <FloorMap
            lots={lots}
            floors={floors}
            spots={spots}
            selectedLotId={selectedLotId}
            setSelectedLotId={setSelectedLotId}
            selectedFloorId={selectedFloorId}
            setSelectedFloorId={setSelectedFloorId}
            selectedSpot={selectedSpot}
            setSelectedSpot={setSelectedSpot}
            onBookSpot={(spot) => setBookingSpot(spot)}
          />
        )}

        {activeTab === 'reservations' && (
          <ActiveReservations
            reservations={reservations}
            onViewPass={(res) => setViewingPass(res)}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onExtendTime={handleExtendTime}
            onCancelReservation={handleCancelReservation}
            onBookNewSpot={() => setActiveTab('nearMe')}
          />
        )}

        {activeTab === 'sensors' && (
          <SensorMonitor
            sensors={sensors}
            spots={spots}
            onTriggerPing={handleTriggerPing}
          />
        )}

        {activeTab === 'mysql' && (
          <MySqlConsole
            onExportSql={handleExportSql}
            defaultQuery={sqlPreQuery}
          />
        )}
      </main>

      {/* Booking Form Modal */}
      {bookingSpot && (
        <BookingModal
          spot={bookingSpot}
          lot={lots.find(l => l.id === bookingSpot.lotId) || lots[0]}
          floor={floors.find(f => f.id === bookingSpot.floorId) || floors[0]}
          onClose={() => setBookingSpot(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Ticket QR Pass Modal */}
      {viewingPass && (
        <TicketPassModal
          reservation={viewingPass}
          onClose={() => setViewingPass(null)}
          onCheckIn={handleCheckIn}
        />
      )}

      {/* HTML + CSS + MySQL Architecture Guide Modal */}
      {codeModalOpen && (
        <CodeArchitectureModal
          onClose={() => setCodeModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ParkPulse</span>
            <span>• Smart Parking Reservation System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>HTML5 Semantic Grid</span>
            <span>• CSS3 Automotive Layout</span>
            <span>• MySQL 8.0 InnoDB Backend</span>
            <button
              onClick={() => setCodeModalOpen(true)}
              className="text-emerald-400 hover:underline font-semibold"
            >
              View System Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
