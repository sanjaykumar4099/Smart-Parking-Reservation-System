import React, { useState } from 'react';
import { SpotSensor, ParkingSpot } from '../types';
import { 
  Radio, 
  Battery, 
  Wifi, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';

interface SensorMonitorProps {
  sensors: SpotSensor[];
  spots: ParkingSpot[];
  onTriggerPing: (sensorId: string, distanceCm: number) => void;
}

export const SensorMonitor: React.FC<SensorMonitorProps> = ({
  sensors,
  spots,
  onTriggerPing
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string>(sensors[0]?.sensorId || '');
  const [testDistance, setTestDistance] = useState<number>(45);

  const selectedSensor = sensors.find(s => s.sensorId === selectedSensorId) || sensors[0];
  const associatedSpot = spots.find(s => s.id === selectedSensor?.spotId);

  // Stats
  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const avgBattery = Math.round(sensors.reduce((acc, s) => acc + s.batteryPercent, 0) / (sensors.length || 1));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold mb-1">
            <Radio className="w-3.5 h-3.5" />
            IoT Ultrasonic Hardware Network
          </div>
          <h2 className="text-2xl font-black text-white">
            Spot Sensors & Real-Time Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Microcontroller ultrasonic & optical nodes mounted on ceiling bays detecting physical vehicle occupancy.
          </p>
        </div>

        {/* Global Hardware Health */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Nodes Online</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">{onlineCount} / {sensors.length}</span>
          </div>

          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Battery</span>
            <span className="text-slate-200 font-bold font-mono text-sm">{avgBattery}%</span>
          </div>
        </div>
      </div>

      {/* Sensor Interactive Tester & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Sensor List */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Sensor Nodes in Network ({sensors.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Mesh Protocol: BLE 5.3 / LoRaWAN
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
            {sensors.slice(0, 36).map((sensor) => {
              const isSelected = sensor.sensorId === selectedSensorId;
              const isOccupied = (sensor.detectedDistanceCm ?? 240) < 80;

              return (
                <button
                  key={sensor.sensorId}
                  onClick={() => setSelectedSensorId(sensor.sensorId)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400 ring-1 ring-emerald-400 shadow-md'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-200">{sensor.spotNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`} />
                  </div>

                  <div className="mt-2 space-y-1 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Dist:</span>
                      <strong className={isOccupied ? 'text-rose-400' : 'text-emerald-400'}>
                        {sensor.detectedDistanceCm} cm
                      </strong>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Bat:</span>
                      <span className="text-slate-300">{sensor.batteryPercent}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Sensor Inspector & Hardware Simulation */}
        {selectedSensor && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">
                  Node Inspector
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-400 block mt-0.5">
                {selectedSensor.sensorId}
              </span>
            </div>

            {/* Live Readout Panel */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Bay:</span>
                <span className="font-bold text-slate-200">{selectedSensor.spotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ultrasonic Echo:</span>
                <span className="font-bold text-emerald-400">{selectedSensor.detectedDistanceCm} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calculated State:</span>
                <span className={`font-bold uppercase ${
                  (selectedSensor.detectedDistanceCm ?? 240) < 80 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {(selectedSensor.detectedDistanceCm ?? 240) < 80 ? 'OCCUPIED' : 'VACANT'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Battery:</span>
                <span className="text-slate-200">{selectedSensor.batteryPercent}% (LiFePO4)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Signal RSSI:</span>
                <span className="text-slate-200">{selectedSensor.signalStrengthDbm} dBm</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                <span>Last Telemetry:</span>
                <span>{new Date(selectedSensor.lastPingTime).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Test Hardware Simulation Trigger */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Simulate Ultrasonic Distance Echo
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerPing(selectedSensor.sensorId, 45)}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-950 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold"
                >
                  Park Car (45cm)
                </button>
                <button
                  onClick={() => onTriggerPing(selectedSensor.sensorId, 240)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 text-xs font-bold"
                >
                  Vacate Bay (240cm)
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Pinging the sensor executes the MySQL trigger <code className="text-cyan-400">trg_after_sensor_telemetry_ping</code> and synchronizes the real-time spot state immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
