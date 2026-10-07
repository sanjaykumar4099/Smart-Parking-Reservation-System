import { ParkingLot, Floor, ParkingSpot, Reservation, SpotSensor, UserLocation } from '../types';

export const USER_LOCATIONS_PRESETS: UserLocation[] = [
  { name: 'Peelamedu / Avinashi Road (College & IT Corridor)', lat: 11.0285, lng: 77.0180 },
  { name: 'Gandhipuram Cross Cut Road Hub', lat: 11.0183, lng: 76.9644 },
  { name: 'RS Puram (DB Road Commercial Center)', lat: 11.0084, lng: 76.9482 },
  { name: 'Coimbatore Railway Junction (State Bank Rd)', lat: 10.9980, lng: 76.9634 },
  { name: 'Brookefields Mall (Krishnaswamy Rd)', lat: 11.0125, lng: 76.9587 },
  { name: 'Coimbatore International Airport (CJB)', lat: 11.0300, lng: 77.0434 }
];

export const INITIAL_PARKING_LOTS: ParkingLot[] = [
  {
    id: 1,
    name: 'Gandhipuram Multi-Level Smart Parking (MLCP)',
    tagline: 'Automated 4-tier puzzle parking with EV Fast Charging on Cross Cut Rd',
    address: 'Cross Cut Road, Gandhipuram',
    city: 'Coimbatore, Tamil Nadu',
    lat: 11.0183,
    lng: 76.9644,
    hourlyRate: 40.00,
    totalSpots: 72,
    availableSpots: 48,
    evSpots: 16,
    accessibleSpots: 6,
    rating: 4.8,
    reviewsCount: 480,
    operatingHours: '24/7 Monitored Access',
    hasCctv: true,
    hasCoveredRoof: true,
    hasValet: false,
    entranceLane: 'Gate 1 (Cross Cut Rd Entry)'
  },
  {
    id: 2,
    name: 'Peelamedu Tech Corridor Smart Deck',
    tagline: 'Solar-covered bays next to Avinashi Road educational & IT institutions',
    address: 'Avinashi Road, Peelamedu (Near PSG & GRD)',
    city: 'Coimbatore, Tamil Nadu',
    lat: 11.0285,
    lng: 77.0180,
    hourlyRate: 30.00,
    totalSpots: 64,
    availableSpots: 41,
    evSpots: 14,
    accessibleSpots: 4,
    rating: 4.9,
    reviewsCount: 520,
    operatingHours: '6:00 AM - Midnight Daily',
    hasCctv: true,
    hasCoveredRoof: true,
    hasValet: true,
    entranceLane: 'Main Gate (Avinashi Rd Service Lane)'
  },
  {
    id: 3,
    name: 'Brookefields Mall Automated Garage',
    tagline: 'High-capacity covered basement & multi-deck facility with 60kW DC Fast Chargers',
    address: '67-71 Dr. Krishnaswamy Mudaliar Rd',
    city: 'Coimbatore, Tamil Nadu',
    lat: 11.0125,
    lng: 76.9587,
    hourlyRate: 50.00,
    totalSpots: 56,
    availableSpots: 24,
    evSpots: 10,
    accessibleSpots: 4,
    rating: 4.7,
    reviewsCount: 890,
    operatingHours: '9:00 AM - 11:30 PM',
    hasCctv: true,
    hasCoveredRoof: true,
    hasValet: true,
    entranceLane: 'Basement Ramp B1 (West Wing)'
  },
  {
    id: 4,
    name: 'RS Puram DB Road Smart On-Street Plaza',
    tagline: 'Sensor-monitored smart bays on Diwan Bahadur Road shopping street',
    address: 'DB Road, R.S. Puram West',
    city: 'Coimbatore, Tamil Nadu',
    lat: 11.0084,
    lng: 76.9482,
    hourlyRate: 35.00,
    totalSpots: 48,
    availableSpots: 16,
    evSpots: 8,
    accessibleSpots: 4,
    rating: 4.6,
    reviewsCount: 340,
    operatingHours: '8:00 AM - 11:00 PM',
    hasCctv: true,
    hasCoveredRoof: false,
    hasValet: false,
    entranceLane: 'DB Road North Bay Entry'
  },
  {
    id: 5,
    name: 'Coimbatore Junction Railway Station MLCP',
    tagline: 'Southern Railway multi-level automated deck with fast FASTag & QR gates',
    address: 'State Bank Road, Gopalapuram',
    city: 'Coimbatore, Tamil Nadu',
    lat: 10.9980,
    lng: 76.9634,
    hourlyRate: 25.00,
    totalSpots: 60,
    availableSpots: 32,
    evSpots: 10,
    accessibleSpots: 4,
    rating: 4.5,
    reviewsCount: 650,
    operatingHours: '24/7 Round the Clock',
    hasCctv: true,
    hasCoveredRoof: true,
    hasValet: false,
    entranceLane: 'Station Main Gate (State Bank Rd)'
  }
];

export const INITIAL_FLOORS: Floor[] = [
  // Lot 1: Gandhipuram MLCP
  { id: 101, lotId: 1, floorNumber: 1, floorName: 'Level 1 - Ground Express', levelCode: 'L1', totalSpots: 24, availableSpots: 16 },
  { id: 102, lotId: 1, floorNumber: 2, floorName: 'Level 2 - EV Hub & Two-Wheelers', levelCode: 'L2', totalSpots: 24, availableSpots: 18 },
  { id: 103, lotId: 1, floorNumber: 3, floorName: 'Level 3 - Rooftop Premium', levelCode: 'L3', totalSpots: 24, availableSpots: 14 },

  // Lot 2: Peelamedu Tech Deck
  { id: 201, lotId: 2, floorNumber: 1, floorName: 'Floor G - Quick Arrivals', levelCode: 'G', totalSpots: 32, availableSpots: 21 },
  { id: 202, lotId: 2, floorNumber: 2, floorName: 'Floor 2 - Tech SkyDeck', levelCode: 'L2', totalSpots: 32, availableSpots: 20 },

  // Lot 3: Brookefields Mall
  { id: 301, lotId: 3, floorNumber: 1, floorName: 'Basement B1 - Mall Access', levelCode: 'B1', totalSpots: 28, availableSpots: 11 },
  { id: 302, lotId: 3, floorNumber: 2, floorName: 'Basement B2 - EV Stations', levelCode: 'B2', totalSpots: 28, availableSpots: 13 },

  // Lot 4: RS Puram
  { id: 401, lotId: 4, floorNumber: 1, floorName: 'DB North Zone A', levelCode: 'N1', totalSpots: 24, availableSpots: 8 },
  { id: 402, lotId: 4, floorNumber: 2, floorName: 'DB South Zone B', levelCode: 'S1', totalSpots: 24, availableSpots: 8 },

  // Lot 5: Coimbatore Junction
  { id: 501, lotId: 5, floorNumber: 1, floorName: 'Platform 1 Deck', levelCode: 'P1', totalSpots: 30, availableSpots: 15 },
  { id: 502, lotId: 5, floorNumber: 2, floorName: 'Upper Transit Deck', levelCode: 'P2', totalSpots: 30, availableSpots: 17 }
];

export function generateInitialSpotsAndSensors(): { spots: ParkingSpot[]; sensors: SpotSensor[] } {
  const spots: ParkingSpot[] = [];
  const sensors: SpotSensor[] = [];

  let spotGlobalId = 1;

  for (const floor of INITIAL_FLOORS) {
    const spotsCount = floor.totalSpots;
    const half = Math.floor(spotsCount / 2);

    for (let i = 1; i <= spotsCount; i++) {
      const isRowA = i <= half;
      const rowLetter = isRowA ? 'A' : 'B';
      const colNum = isRowA ? i : i - half;
      const spotCode = `${floor.levelCode}-${rowLetter}${colNum < 10 ? '0' + colNum : colNum}`;

      // Spot Type & Rate in INR
      let type: ParkingSpot['spotType'] = 'standard';
      let charger: ParkingSpot['chargerType'] = 'None';
      let hourlyRate = 35.00;

      if (floor.lotId === 1 && floor.levelCode === 'L2' && colNum <= 6) {
        type = 'ev';
        charger = colNum <= 2 ? 'Supercharger (150kW)' : 'DC Fast (50kW)';
        hourlyRate = 50.00;
      } else if (floor.lotId === 2 && colNum <= 4) {
        type = 'ev';
        charger = 'Level 2 AC (7kW)';
        hourlyRate = 45.00;
      } else if (floor.lotId === 3 && floor.levelCode === 'B2' && colNum <= 5) {
        type = 'ev';
        charger = 'DC Fast (50kW)';
        hourlyRate = 60.00;
      } else if (colNum === 1 && isRowA) {
        type = 'accessible';
        hourlyRate = 25.00;
      } else if (colNum === half && !isRowA) {
        type = 'vip';
        hourlyRate = 55.00;
      } else if (colNum === half - 1 && !isRowA && floor.lotId === 5) {
        type = 'motorcycle';
        hourlyRate = 15.00;
      }

      // Initial occupancy
      const rand = (spotGlobalId * 19 + i * 11) % 100;
      let status: ParkingSpot['status'] = 'available';
      let isAvailable = true;
      let plate: string | undefined = undefined;

      // Realistic Tamil Nadu Coimbatore (TN 38, TN 66, TN 37, TN 99) plates
      const tnRto = ['38', '66', '37', '99', '43'][spotGlobalId % 5];
      const series = ['AA', 'BZ', 'CD', 'EV', 'TR'][i % 5];
      const plateNum = 1000 + ((spotGlobalId * 83) % 8999);

      if (rand < 30) {
        status = 'occupied';
        isAvailable = false;
        plate = `TN-${tnRto}-${series}-${plateNum}`;
      } else if (rand < 38) {
        status = 'reserved';
        isAvailable = false;
      }

      const sensorId = `SEN-CBE-${floor.lotId}-${floor.levelCode}-${spotCode}`;
      const nowIso = new Date().toISOString();

      spots.push({
        id: spotGlobalId,
        lotId: floor.lotId,
        floorId: floor.id,
        floorLevel: floor.levelCode,
        spotNumber: spotCode,
        rowLetter,
        columnNumber: colNum,
        spotType: type,
        status,
        isAvailable,
        hourlyRate,
        chargerType: charger,
        maxVehicleHeightMeters: 2.2,
        sensorId,
        lastUpdated: nowIso,
        currentPlate: plate
      });

      sensors.push({
        sensorId,
        spotId: spotGlobalId,
        spotNumber: spotCode,
        lotId: floor.lotId,
        sensorType: type === 'ev' ? 'AI Optical Camera' : 'Ultrasonic',
        batteryPercent: Math.min(100, Math.max(50, 100 - (spotGlobalId % 35))),
        signalStrengthDbm: -52 - (spotGlobalId % 20),
        detectedDistanceCm: status === 'occupied' ? 45 : status === 'reserved' ? 120 : 240,
        status: 'online',
        lastPingTime: nowIso
      });

      spotGlobalId++;
    }
  }

  return { spots, sensors };
}

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-cbe-101',
    bookingCode: 'PK-CBE-4921',
    userId: 1,
    userName: 'Karthik Sundaram',
    userPhone: '+91 98421 23456',
    userEmail: 'karthik.sundaram@example.com',
    lotId: 1,
    lotName: 'Gandhipuram Multi-Level Smart Parking (MLCP)',
    lotAddress: 'Cross Cut Road, Gandhipuram',
    floorLevel: 'L1',
    spotId: 8,
    spotNumber: 'L1-A08',
    spotType: 'standard',
    vehiclePlate: 'TN-38-BZ-4921',
    vehicleModel: 'Hyundai Creta (White)',
    vehicleType: 'Compact SUV',
    startTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 85 * 60 * 1000).toISOString(),
    durationHours: 2,
    hourlyRate: 40.00,
    subtotal: 80.00,
    serviceFee: 5.00,
    tax: 15.30, // 18% GST (9% CGST + 9% SGST)
    totalAmount: 100.30,
    status: 'active',
    checkInTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    qrToken: 'TOKEN-PK-CBE-4921-TAMILNADU-VALID',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  }
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}
