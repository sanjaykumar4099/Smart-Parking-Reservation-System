import React from 'react';
import { Reservation } from '../types';
import { 
  Ticket, 
  Car, 
  MapPin, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  ArrowRight,
  Database,
  Calendar
} from 'lucide-react';

interface ActiveReservationsProps {
  reservations: Reservation[];
  onViewPass: (res: Reservation) => void;
  onCheckIn: (resId: string) => void;
  onCheckOut: (resId: string) => void;
  onExtendTime: (resId: string) => void;
  onCancelReservation: (resId: string) => void;
  onBookNewSpot: () => void;
}

export const ActiveReservations: React.FC<ActiveReservationsProps> = ({
  reservations,
  onViewPass,
  onCheckIn,
  onCheckOut,
  onExtendTime,
  onCancelReservation,
  onBookNewSpot
}) => {
  const activeList = reservations.filter(r => r.status === 'active');
  const pastList = reservations.filter(r => r.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold mb-1">
            <Ticket className="w-3.5 h-3.5" />
            MySQL-Managed Sessions
          </div>
          <h2 className="text-2xl font-black text-white">
            My Parking Passes & Bookings
          </h2>
          <p className="text-xs text-slate-400">
            Active gate passes with real-time countdown, automatic bay assignment & contactless QR entry.
          </p>
        </div>

        <button
          onClick={onBookNewSpot}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
        >
          <Car className="w-4 h-4" />
          <span>Book Another Spot</span>
        </button>
      </div>

      {/* Active Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Passes ({activeList.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Synced with table: `reservations`
          </span>
        </div>

        {activeList.length === 0 ? (
          <div className="p-10 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-semibold text-slate-300">No active parking sessions</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Find an available spot on the radar or interactive floor map to make your first reservation.
            </p>
            <button
              onClick={onBookNewSpot}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              Explore Nearby Available Spots
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeList.map((res) => {
              const startFormatted = new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endFormatted = new Date(res.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={res.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-emerald-700/60 transition-all"
                >
                  <div className="space-y-3">
                    {/* Header: Lot and Bay Number */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white">
                            Bay {res.spotNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {res.lotName} • Level {res.floorLevel}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">PIN CODE</span>
                        <span className="text-sm font-mono font-black text-emerald-400">
                          {res.bookingCode}
                        </span>
                      </div>
                    </div>

                    {/* Vehicle & Time Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Vehicle Plate</span>
                        <div className="font-mono font-bold text-slate-200 mt-0.5">
                          {res.vehiclePlate}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {res.vehicleModel}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Time Window</span>
                        <div className="font-semibold text-slate-200 mt-0.5">
                          {startFormatted} – {endFormatted}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ({res.durationHours}h total reserved)
                        </div>
                      </div>
                    </div>

                    {/* SQL Reference info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                      <span>Total Paid: <strong className="text-emerald-400 font-bold">₹{res.totalAmount.toFixed(2)}</strong></span>
                      <span className="text-slate-500">ID: {res.id.slice(0, 12)}...</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onExtendTime(res.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
                        title="Extend duration by 1 hour"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+1 Hr</span>
                      </button>

                      <button
                        onClick={() => onCancelReservation(res.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 border border-rose-900/40"
                        title="Cancel reservation and free up spot"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onCheckOut(res.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                        title="End parking session and free up bay"
                      >
                        Check-Out
                      </button>

                      <button
                        onClick={() => onViewPass(res)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show QR Pass</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past / Completed Sessions */}
      {pastList.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Past Parking History ({pastList.length})
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
            {pastList.map((res) => (
              <div key={res.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">
                      Bay {res.spotNumber} • {res.lotName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      res.status === 'completed'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Vehicle: {res.vehiclePlate} ({res.vehicleModel}) • Code: {res.bookingCode}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-slate-400">
                  <span className="font-mono font-bold text-slate-300">
                    ₹{res.totalAmount.toFixed(2)}
                  </span>
                  <span className="text-[11px]">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
