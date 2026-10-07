import React, { useState } from 'react';
import { ParkingSpot, ParkingLot, Floor, Reservation } from '../types';
import { 
  X, 
  Car, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Calendar, 
  DollarSign, 
  Database,
  ArrowRight
} from 'lucide-react';

interface BookingModalProps {
  spot: ParkingSpot;
  lot: ParkingLot;
  floor: Floor;
  onClose: () => void;
  onConfirmBooking: (newReservation: Reservation) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  spot,
  lot,
  floor,
  onClose,
  onConfirmBooking
}) => {
  const [vehiclePlate, setVehiclePlate] = useState('TN-38-BZ-4921');
  const [vehicleModel, setVehicleModel] = useState('Hyundai Creta (White)');
  const [vehicleType, setVehicleType] = useState('Compact SUV');
  const [durationHours, setDurationHours] = useState(2);
  const [driverName, setDriverName] = useState('Karthik Sundaram');
  const [driverPhone, setDriverPhone] = useState('+91 98421 23456');
  const [driverEmail, setDriverEmail] = useState('karthik.sundaram@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing calculation in INR (with 18% GST)
  const subtotal = spot.hourlyRate * durationHours;
  const serviceFee = 5.00; // ₹5 FASTag / IoT Platform fee
  const tax = Number((subtotal * 0.18).toFixed(2)); // 18% GST (9% CGST + 9% SGST)
  const totalAmount = Number((subtotal + serviceFee + tax).toFixed(2));

  const handleQuickPlate = (plate: string, model: string, type: string) => {
    setVehiclePlate(plate);
    setVehicleModel(model);
    setVehicleType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const end = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
    const bookingCode = `PK-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const reservationId = `res-${Date.now()}`;
    const qrToken = `TOKEN-${bookingCode}-${Date.now()}-VALID`;

    const newReservation: Reservation = {
      id: reservationId,
      bookingCode,
      userId: 1,
      userName: driverName,
      userPhone: driverPhone,
      userEmail: driverEmail,
      lotId: lot.id,
      lotName: lot.name,
      lotAddress: lot.address,
      floorLevel: floor.levelCode,
      spotId: spot.id,
      spotNumber: spot.spotNumber,
      spotType: spot.spotType,
      vehiclePlate: vehiclePlate.toUpperCase().trim(),
      vehicleModel,
      vehicleType,
      startTime: now.toISOString(),
      endTime: end.toISOString(),
      durationHours,
      hourlyRate: spot.hourlyRate,
      subtotal,
      serviceFee,
      tax,
      totalAmount,
      status: 'active',
      qrToken,
      createdAt: now.toISOString()
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmBooking(newReservation);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Reserve Parking Spot {spot.spotNumber}
              </h3>
              <p className="text-xs text-slate-400">
                {lot.name} • {floor.floorName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto">
          {/* Spot Summary Badge */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold text-sm">
                Bay {spot.spotNumber}
              </span>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">
                  {spot.spotType.toUpperCase()} PARKING
                </div>
                <div className="text-slate-400 text-[11px]">
                  Sensor: <span className="font-mono text-slate-300">{spot.sensorId}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-extrabold text-emerald-400">
                ₹{spot.hourlyRate.toFixed(0)}/hr
              </div>
              {spot.chargerType && spot.chargerType !== 'None' && (
                <div className="text-[10px] text-cyan-400 font-semibold flex items-center justify-end gap-1">
                  <Zap className="w-3 h-3" /> {spot.chargerType}
                </div>
              )}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Parking Duration
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 8].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDurationHours(hrs)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                    durationHours === hrs
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-cyan-400" />
                Vehicle Details (Automated Gate LPR)
              </label>
              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickPlate('TN-38-EV-2026', 'Tata Nexon EV (Teal)', 'EV SUV')}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 font-mono"
                >
                  Nexon EV
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPlate('TN-66-AB-1010', 'Maruti Swift (Red)', 'Hatchback')}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono"
                >
                  Swift
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPlate('TN-37-TR-8899', 'Royal Enfield Classic 350', 'Two-Wheeler')}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-orange-300 hover:bg-slate-700 font-mono"
                >
                  Bike
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">License Plate Number (TN RTO)</span>
                <input
                  type="text"
                  required
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  placeholder="e.g. TN-38-BZ-4921"
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white uppercase tracking-wider focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium">Make & Model</span>
                <input
                  type="text"
                  required
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Hyundai Creta"
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">
              Driver Details (For Pass Verification & SMS)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Price Breakdown in INR */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Parking Rate ({durationHours}h × ₹{spot.hourlyRate.toFixed(0)})</span>
              <span className="text-slate-200 font-mono">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Smart IoT Sensor & FASTag Fee</span>
              <span className="text-slate-200 font-mono">₹{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST (18% - 9% CGST + 9% SGST)</span>
              <span className="text-slate-200 font-mono">₹{tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
              <span>Total Payable</span>
              <span className="text-emerald-400 font-mono font-extrabold text-base">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Relational MySQL Action Info */}
          <div className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-cyan-900/40 text-[11px] text-cyan-300/90 font-mono">
            <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span>SQL: INSERT INTO reservations (booking_code, spot_id, ...)</span>
              <span className="block text-[10px] text-slate-400 font-sans">
                Spot status automatically updates via MySQL trigger <code className="text-emerald-400">trg_after_reservation_created</code>.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Confirming in MySQL...' : 'Confirm & Generate Pass'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
