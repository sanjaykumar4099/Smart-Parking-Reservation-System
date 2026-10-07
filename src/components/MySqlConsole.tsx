import React, { useState } from 'react';
import { mySqlEngine, MYSQL_TABLE_DEFINITIONS } from '../services/mysqlEngine';
import { QueryResult } from '../types';
import { 
  Database, 
  Play, 
  Terminal, 
  Table as TableIcon, 
  Network, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';

interface MySqlConsoleProps {
  onExportSql: () => void;
  defaultQuery?: string;
}

export const MySqlConsole: React.FC<MySqlConsoleProps> = ({
  onExportSql,
  defaultQuery
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'query' | 'tables' | 'diagram' | 'triggers' | 'export'>('query');
  const [currentQuery, setCurrentQuery] = useState(defaultQuery || 'SELECT * FROM v_live_available_spots;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(() => {
    return mySqlEngine.executeQuery(defaultQuery || 'SELECT * FROM v_live_available_spots;');
  });
  const [selectedTable, setSelectedTable] = useState<string>('parking_spots');
  const [copied, setCopied] = useState(false);

  const sampleQueries = [
    {
      title: 'Real-Time Available Spots View',
      sql: 'SELECT * FROM v_live_available_spots;'
    },
    {
      title: 'Free EV Charging Bays',
      sql: "SELECT spot_number, floor_name, charger_type, hourly_rate FROM v_live_available_spots WHERE spot_type = 'ev';"
    },
    {
      title: 'Availability Count by Garage (JOIN + GROUP BY)',
      sql: 'SELECT l.name, COUNT(s.id) AS free_spots FROM parking_lots l JOIN parking_spots s ON l.id = s.lot_id WHERE s.is_available = 1 GROUP BY l.id;'
    },
    {
      title: 'Active Driver Reservations',
      sql: 'SELECT r.booking_code, r.vehicle_plate, s.spot_number, r.status, r.total_amount FROM reservations r JOIN parking_spots s ON r.spot_id = s.id;'
    },
    {
      title: 'Ultrasonic IoT Sensors Status',
      sql: 'SELECT sensor_id, spot_id, battery_percent, signal_strength_dbm, detected_distance_cm, status FROM spot_sensors ORDER BY battery_percent ASC;'
    },
    {
      title: 'Show All Tables',
      sql: 'SHOW TABLES;'
    },
    {
      title: 'Describe parking_spots Table',
      sql: 'DESCRIBE parking_spots;'
    }
  ];

  const handleRunQuery = () => {
    const res = mySqlEngine.executeQuery(currentQuery);
    setQueryResult(res);
  };

  const handleSelectSample = (sql: string) => {
    setCurrentQuery(sql);
    const res = mySqlEngine.executeQuery(sql);
    setQueryResult(res);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(mySqlEngine.generateFullSqlDump());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tableNames = mySqlEngine.getTableNames();
  const currentTableData = mySqlEngine.getTableData(selectedTable);
  const currentTableDef = MYSQL_TABLE_DEFINITIONS.find(t => t.name === selectedTable);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-semibold mb-1">
            <Database className="w-3.5 h-3.5" />
            MySQL 8.0 Relational Engine
          </div>
          <h2 className="text-2xl font-black text-white">
            MySQL Studio & Query Workbench
          </h2>
          <p className="text-xs text-slate-400">
            Direct SQL querying, schema introspection, relational ER modeling, and exportable production DDL scripts.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('query')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'query'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Query Editor
          </button>
          <button
            onClick={() => setActiveSubTab('tables')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'tables'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Table Browser
          </button>
          <button
            onClick={() => setActiveSubTab('diagram')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'diagram'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ER Diagram
          </button>
          <button
            onClick={() => setActiveSubTab('triggers')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'triggers'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Triggers
          </button>
          <button
            onClick={() => setActiveSubTab('export')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'export'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dump .SQL
          </button>
        </div>
      </div>

      {/* SUBTAB 1: QUERY RUNNER */}
      {activeSubTab === 'query' && (
        <div className="space-y-4">
          {/* Quick Query Templates */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Sample SQL:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(q.sql)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-700/60 transition-all font-mono text-[11px] shrink-0"
              >
                {q.title}
              </button>
            ))}
          </div>

          {/* SQL Editor Window */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>mysql&gt; query.sql</span>
                <span className="text-slate-600">| DB: `smart_parking`</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentQuery('')}
                  className="px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
                <button
                  onClick={handleRunQuery}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 font-mono text-xs">
              <textarea
                aria-label="SQL Query Input"
                rows={3}
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    handleRunQuery();
                  }
                }}
                placeholder="Enter MySQL query (e.g. SELECT * FROM parking_spots WHERE is_available = 1)..."
                className="w-full bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
              <div className="text-[10px] text-slate-600 mt-1 flex justify-between">
                <span>Tip: Press Ctrl + Enter (Cmd + Enter) to run</span>
                <span>Supported: SELECT, JOIN, WHERE, ORDER BY, LIMIT, SHOW, DESCRIBE, INSERT, UPDATE</span>
              </div>
            </div>
          </div>

          {/* Result Output Window */}
          {queryResult && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">Execution Result</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                    {queryResult.rowCount} rows in set ({queryResult.executionTimeMs} ms)
                  </span>
                </div>

                {queryResult.error && (
                  <span className="text-xs text-rose-400 font-mono font-bold">
                    ERROR 1064 (42000)
                  </span>
                )}
              </div>

              {queryResult.error ? (
                <div className="p-4 bg-rose-950/30 text-rose-300 font-mono text-xs border-l-4 border-rose-500">
                  {queryResult.error}
                </div>
              ) : queryResult.rows.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-mono">
                  Empty set (0.00 sec)
                </div>
              ) : (
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 sticky top-0">
                      <tr>
                        {queryResult.columns.map((col) => (
                          <th key={col} className="p-2.5 font-bold uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {queryResult.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          {queryResult.columns.map((col) => {
                            const val = row[col];
                            return (
                              <td key={col} className="p-2.5 whitespace-nowrap">
                                {val === null || val === undefined ? (
                                  <span className="text-slate-600 italic">NULL</span>
                                ) : typeof val === 'boolean' ? (
                                  val ? '1' : '0'
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: TABLE BROWSER (phpMyAdmin Style) */}
      {activeSubTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Table List */}
          <div className="md:col-span-1 bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Tables in `smart_parking`
            </span>
            <div className="space-y-1">
              {tableNames.map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => setSelectedTable(tbl)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center justify-between transition-all ${
                    selectedTable === tbl
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <TableIcon className="w-3.5 h-3.5" />
                    {tbl}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {mySqlEngine.getTableData(tbl).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Inspector */}
          <div className="md:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-cyan-400" />
                  Table: `{selectedTable}`
                </h3>
                <p className="text-xs text-slate-400">
                  {currentTableDef?.comment || 'Relational entity'} • {currentTableData.length} total rows
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentQuery(`SELECT * FROM ${selectedTable} LIMIT 50;`);
                  setActiveSubTab('query');
                  handleRunQuery();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold"
              >
                SELECT * FROM `{selectedTable}`
              </button>
            </div>

            {/* Schema Columns list */}
            {currentTableDef && (
              <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block mb-1">
                  Table Columns & Data Types
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentTableDef.columns.map((col) => (
                    <div key={col.name} className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-200">{col.name}</span>
                        {col.isPrimary && <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300">PK</span>}
                        {col.isForeign && <span className="text-[9px] px-1 rounded bg-blue-950 text-blue-300">FK</span>}
                      </div>
                      <span className="text-[10px] text-slate-400">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table Rows preview */}
            <div className="overflow-x-auto max-h-72 border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 sticky top-0">
                  <tr>
                    {currentTableDef?.columns.map((c) => (
                      <th key={c.name} className="p-2 font-bold whitespace-nowrap">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {currentTableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      {currentTableDef?.columns.map((c) => (
                        <td key={c.name} className="p-2 whitespace-nowrap">
                          {row[c.name] !== undefined ? String(row[c.name]) : 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ER DIAGRAM */}
      {activeSubTab === 'diagram' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              Entity-Relationship (ER) Schema Map
            </h3>
            <p className="text-xs text-slate-400">
              Normalized MySQL 8.0 schema with Foreign Keys and 1-to-Many relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Box 1: parking_lots */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400">parking_lots</span>
                <span className="text-[10px] text-slate-500">PARENT</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex justify-between"><span className="text-amber-400 font-bold">id (PK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span>name</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>latitude, longitude</span> <span>DECIMAL</span></li>
                <li className="flex justify-between"><span>hourly_rate</span> <span>DECIMAL</span></li>
                <li className="flex justify-between"><span>total_spots</span> <span>INT</span></li>
              </ul>
            </div>

            {/* Box 2: floors */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-400">floors</span>
                <span className="text-[10px] text-slate-500">1:M</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex justify-between"><span className="text-amber-400 font-bold">id (PK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span className="text-blue-400">lot_id (FK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span>floor_name</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>level_code</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>total_spots</span> <span>INT</span></li>
              </ul>
            </div>

            {/* Box 3: parking_spots */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-800/80 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-300">parking_spots</span>
                <span className="text-[10px] text-emerald-400">CORE ENTITY</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex justify-between"><span className="text-amber-400 font-bold">id (PK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span className="text-blue-400">lot_id (FK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span className="text-blue-400">floor_id (FK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span>spot_number</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>status</span> <span>ENUM</span></li>
                <li className="flex justify-between"><span>is_available</span> <span>TINYINT(1)</span></li>
                <li className="flex justify-between"><span>hourly_rate</span> <span>DECIMAL</span></li>
              </ul>
            </div>

            {/* Box 4: spot_sensors */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-purple-400">spot_sensors</span>
                <span className="text-[10px] text-slate-500">IoT NODES</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex justify-between"><span className="text-amber-400 font-bold">sensor_id (PK)</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span className="text-blue-400">spot_id (FK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span>battery_percent</span> <span>INT</span></li>
                <li className="flex justify-between"><span>detected_distance_cm</span> <span>INT</span></li>
                <li className="flex justify-between"><span>last_ping_time</span> <span>DATETIME</span></li>
              </ul>
            </div>

            {/* Box 5: reservations */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400">reservations</span>
                <span className="text-[10px] text-slate-500">TRANSACTIONS</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex justify-between"><span className="text-amber-400 font-bold">id (PK)</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>booking_code</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span className="text-blue-400">user_id (FK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span className="text-blue-400">spot_id (FK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span>vehicle_plate</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>start_time, end_time</span> <span>DATETIME</span></li>
                <li className="flex justify-between"><span>total_amount</span> <span>DECIMAL</span></li>
              </ul>
            </div>

            {/* Box 6: users */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">users</span>
                <span className="text-[10px] text-slate-500">DRIVERS</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex justify-between"><span className="text-amber-400 font-bold">id (PK)</span> <span>INT</span></li>
                <li className="flex justify-between"><span>full_name</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>email</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>phone</span> <span>VARCHAR</span></li>
                <li className="flex justify-between"><span>membership_tier</span> <span>ENUM</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: TRIGGERS */}
      {activeSubTab === 'triggers' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">
              MySQL Triggers & Stored Logic
            </h3>
            <p className="text-xs text-slate-400">
              Automated database events ensuring real-time consistency between bookings, physical IoT sensors, and spot availability.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block font-sans">
                Trigger 1: `trg_after_reservation_created`
              </span>
              <p className="text-slate-400 font-sans text-xs">
                When a new reservation is inserted, automatically marks the target parking bay as reserved and sets is_available = 0.
              </p>
              <pre className="text-cyan-300 overflow-x-auto p-2 bg-slate-900 rounded">
{`CREATE TRIGGER trg_after_reservation_created
AFTER INSERT ON reservations
FOR EACH ROW
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE parking_spots
    SET status = 'reserved', is_available = 0, last_updated = NOW()
    WHERE id = NEW.spot_id;
  END IF;
END;`}
              </pre>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block font-sans">
                Trigger 2: `trg_after_reservation_updated`
              </span>
              <p className="text-slate-400 font-sans text-xs">
                When a reservation expires or is cancelled, automatically restores the parking spot to 'available'.
              </p>
              <pre className="text-cyan-300 overflow-x-auto p-2 bg-slate-900 rounded">
{`CREATE TRIGGER trg_after_reservation_updated
AFTER UPDATE ON reservations
FOR EACH ROW
BEGIN
  IF NEW.status IN ('completed', 'cancelled') AND OLD.status = 'active' THEN
    UPDATE parking_spots
    SET status = 'available', is_available = 1, last_updated = NOW()
    WHERE id = NEW.spot_id;
  END IF;
END;`}
              </pre>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block font-sans">
                Trigger 3: `trg_after_sensor_telemetry_ping`
              </span>
              <p className="text-slate-400 font-sans text-xs">
                When IoT ultrasonic sensor detects distance &lt; 80cm (vehicle parked physically), flips spot to 'occupied'.
              </p>
              <pre className="text-cyan-300 overflow-x-auto p-2 bg-slate-900 rounded">
{`CREATE TRIGGER trg_after_sensor_telemetry_ping
AFTER UPDATE ON spot_sensors
FOR EACH ROW
BEGIN
  IF NEW.detected_distance_cm < 80 THEN
    UPDATE parking_spots
    SET status = 'occupied', is_available = 0, last_updated = NOW()
    WHERE id = NEW.spot_id AND status != 'reserved';
  ELSEIF NEW.detected_distance_cm >= 180 THEN
    UPDATE parking_spots
    SET status = 'available', is_available = 1, last_updated = NOW()
    WHERE id = NEW.spot_id AND status = 'occupied';
  END IF;
END;`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: EXPORT SQL */}
      {activeSubTab === 'export' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                Complete Production MySQL Script (`smart_parking.sql`)
              </h3>
              <p className="text-xs text-slate-400">
                Ready to import into MySQL Command Line, MySQL Workbench, or phpMyAdmin.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>

              <button
                onClick={onExportSql}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .SQL File</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-cyan-300">
            <pre>{mySqlEngine.generateFullSqlDump()}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
