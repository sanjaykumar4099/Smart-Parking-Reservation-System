import React, { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { 
  X, 
  QrCode, 
  Car, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Printer, 
  ShieldCheck, 
  Compass,
  Zap,
  Radio
} from 'lucide-react';

interface TicketPassModalProps {
  reservation: Reservation;
  onClose: () => void;
  onCheckIn?: (resId: string) => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  reservation,
  onClose,
  onCheckIn
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [barrierState, setBarrierState] = useState<'idle' | 'scanning' | 'lifted'>('idle');

  useEffect(() => {
    const updateCountdown = () => {
      const end = new Date(reservation.endTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [reservation.endTime]);

  const handleSimulateGateScan = () => {
    setBarrierState('scanning');
    setTimeout(() => {
      setBarrierState('lifted');
      if (onCheckIn) onCheckIn(reservation.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Pass Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100">
                Official Digital Parking Pass
              </span>
              <h3 className="text-xl font-extrabold tracking-tight">
                Bay {reservation.spotNumber}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Content */}
        <div className="p-6 space-y-5 bg-slate-900 text-slate-100">
          {/* Booking Code and Status */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Booking Code</span>
              <div className="text-base font-black font-mono text-emerald-400 tracking-wider">
                {reservation.bookingCode}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Expires In</span>
              <div className="text-sm font-bold font-mono text-amber-300">
                {timeLeft}
              </div>
            </div>
          </div>

          {/* QR Code Graphic with Scan Animation */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner text-slate-950 relative overflow-hidden">
            {/* Simulated QR Code SVG pattern */}
            <div className="relative p-2 bg-white rounded-xl">
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="currentColor">
                {/* QR Pattern Corners */}
                <rect x="5" y="5" width="26" height="26" fill="black" />
                <rect x="8" y="8" width="20" height="20" fill="white" />
                <rect x="12" y="12" width="12" height="12" fill="black" />

                <rect x="69" y="5" width="26" height="26" fill="black" />
                <rect x="72" y="8" width="20" height="20" fill="white" />
                <rect x="76" y="12" width="12" height="12" fill="black" />

                <rect x="5" y="69" width="26" height="26" fill="black" />
                <rect x="8" y="72" width="20" height="20" fill="white" />
                <rect x="12" y="76" width="12" height="12" fill="black" />

                {/* Randomized QR Data Matrix Dots */}
                <rect x="36" y="10" width="8" height="8" fill="black" />
                <rect x="50" y="8" width="12" height="6" fill="black" />
                <rect x="42" y="22" width="14" height="6" fill="black" />
                <rect x="10" y="38" width="6" height="14" fill="black" />
                <rect x="22" y="42" width="10" height="8" fill="black" />
                <rect x="38" y="38" width="16" height="16" fill="black" />
                <rect x="60" y="38" width="8" height="12" fill="black" />
                <rect x="74" y="44" width="14" height="8" fill="black" />
                <rect x="38" y="60" width="8" height="8" fill="black" />
                <rect x="52" y="62" width="12" height="10" fill="black" />
                <rect x="70" y="68" width="16" height="6" fill="black" />
                <rect x="82" y="78" width="8" height="12" fill="black" />
                <rect x="46" y="78" width="10" height="10" fill="black" />
              </svg>

              {barrierState === 'scanning' && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-full h-1 bg-emerald-500 shadow-lg shadow-emerald-500 animate-bounce" />
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-800">
                {reservation.qrToken.slice(0, 24)}...
              </span>
              <p className="text-[10px] text-slate-500">
                Hold phone to RFID gate scanner at garage entrance
              </p>
            </div>
          </div>

          {/* Garage & Bay Turn-by-Turn Navigation Prompt */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Turn-by-Turn Navigation to Bay</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Drive to <strong className="text-white">{reservation.lotName}</strong>. Proceed through Gate Barrier. Follow signs to <span className="text-emerald-400 font-bold">{reservation.floorLevel}</span>. Your reserved bay <strong className="text-white">{reservation.spotNumber}</strong> is illuminated with green sensor beacon.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-900 text-slate-400">
              <div>
                <span>Vehicle:</span>{' '}
                <strong className="text-slate-200 font-mono">{reservation.vehiclePlate}</strong>
              </div>
              <div>
                <span>Duration:</span>{' '}
                <strong className="text-slate-200">{reservation.durationHours} Hours</strong>
              </div>
            </div>
          </div>

          {/* Gate Barrier Simulation */}
          <div className="space-y-2">
            <button
              onClick={handleSimulateGateScan}
              disabled={barrierState !== 'idle'}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                barrierState === 'lifted'
                  ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${barrierState === 'scanning' ? 'animate-spin' : ''}`} />
              <span>
                {barrierState === 'scanning'
                  ? 'Scanning QR at Entrance Barrier...'
                  : barrierState === 'lifted'
                  ? '✓ Gate Barrier Lifted! Welcome Driver.'
                  : 'Test Gate Check-In (Simulate Scanner)'}
              </span>
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>

            <span className="text-[11px] text-slate-500 font-mono">
              Total: ₹{reservation.totalAmount.toFixed(2)} PAID (FASTag/UPI)
            </span>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
