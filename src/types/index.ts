export type SpotType = 'standard' | 'ev' | 'accessible' | 'vip' | 'motorcycle';
export type SpotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface UserLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface ParkingLot {
  id: number;
  name: string;
  tagline: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  hourlyRate: number;
  totalSpots: number;
  availableSpots: number;
  evSpots: number;
  accessibleSpots: number;
  rating: number;
  reviewsCount: number;
  operatingHours: string;
  hasCctv: boolean;
  hasCoveredRoof: boolean;
  hasValet: boolean;
  entranceLane: string;
}

export interface Floor {
  id: number;
  lotId: number;
  floorNumber: number;
  floorName: string;
  levelCode: string;
  totalSpots: number;
  availableSpots: number;
}

export interface ParkingSpot {
  id: number;
  lotId: number;
  floorId: number;
  floorLevel: string;
  spotNumber: string;
  rowLetter: string;
  columnNumber: number;
  spotType: SpotType;
  status: SpotStatus;
  isAvailable: boolean;
  hourlyRate: number;
  chargerType?: 'None' | 'Level 2 AC (7kW)' | 'DC Fast (50kW)' | 'Supercharger (150kW)';
  maxVehicleHeightMeters: number;
  sensorId: string;
  lastUpdated: string;
  currentPlate?: string;
  reservationId?: string;
}

export interface Reservation {
  id: string;
  bookingCode: string;
  userId: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  lotId: number;
  lotName: string;
  lotAddress: string;
  floorLevel: string;
  spotId: number;
  spotNumber: string;
  spotType: SpotType;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleType: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  durationHours: number;
  hourlyRate: number;
  subtotal: number;
  serviceFee: number;
  tax: number;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  checkInTime?: string;
  checkOutTime?: string;
  qrToken: string;
  createdAt: string;
}

export interface SpotSensor {
  sensorId: string;
  spotId: number;
  spotNumber: string;
  lotId: number;
  sensorType: 'Ultrasonic' | 'Magnetic Ground' | 'AI Optical Camera';
  batteryPercent: number;
  signalStrengthDbm: number;
  lastPingTime: string;
  status: 'online' | 'weak_battery' | 'offline';
  detectedDistanceCm?: number;
}

export interface SqlColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  nullable?: boolean;
  defaultValue?: string;
}

export interface SqlTableDefinition {
  name: string;
  comment: string;
  columns: SqlColumn[];
}

export interface QueryResult {
  query: string;
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}
