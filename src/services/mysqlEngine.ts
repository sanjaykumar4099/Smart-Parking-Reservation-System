import { ParkingLot, Floor, ParkingSpot, Reservation, SpotSensor, SqlTableDefinition, QueryResult } from '../types';

export const MYSQL_TABLE_DEFINITIONS: SqlTableDefinition[] = [
  {
    name: 'users',
    comment: 'Registered drivers and vehicle owners',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true },
      { name: 'full_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'email', type: 'VARCHAR(150)', nullable: false },
      { name: 'phone', type: 'VARCHAR(20)', nullable: false },
      { name: 'membership_tier', type: 'ENUM("standard", "premium", "vip")', defaultValue: "'standard'" },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  },
  {
    name: 'parking_lots',
    comment: 'Smart parking garages and open lots with geolocation',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true },
      { name: 'name', type: 'VARCHAR(150)', nullable: false },
      { name: 'tagline', type: 'VARCHAR(255)' },
      { name: 'address', type: 'VARCHAR(255)', nullable: false },
      { name: 'city', type: 'VARCHAR(100)', defaultValue: "'Coimbatore, TN'" },
      { name: 'latitude', type: 'DECIMAL(10, 8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11, 8)', nullable: false },
      { name: 'hourly_rate', type: 'DECIMAL(6, 2)', nullable: false },
      { name: 'total_spots', type: 'INT', nullable: false },
      { name: 'operating_hours', type: 'VARCHAR(100)', defaultValue: "'24/7 Access'" },
      { name: 'has_cctv', type: 'TINYINT(1)', defaultValue: '1' },
      { name: 'has_covered_roof', type: 'TINYINT(1)', defaultValue: '1' }
    ]
  },
  {
    name: 'floors',
    comment: 'Individual levels and deck zones within a lot',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true },
      { name: 'lot_id', type: 'INT', isForeign: true, references: 'parking_lots(id)' },
      { name: 'floor_number', type: 'INT', nullable: false },
      { name: 'floor_name', type: 'VARCHAR(50)', nullable: false },
      { name: 'level_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'total_spots', type: 'INT', nullable: false }
    ]
  },
  {
    name: 'parking_spots',
    comment: 'Individual bays with real-time occupancy status',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true },
      { name: 'lot_id', type: 'INT', isForeign: true, references: 'parking_lots(id)' },
      { name: 'floor_id', type: 'INT', isForeign: true, references: 'floors(id)' },
      { name: 'spot_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'row_letter', type: 'CHAR(2)', nullable: false },
      { name: 'column_number', type: 'INT', nullable: false },
      { name: 'spot_type', type: 'ENUM("standard", "ev", "accessible", "vip", "motorcycle")', defaultValue: "'standard'" },
      { name: 'status', type: 'ENUM("available", "occupied", "reserved", "maintenance")', defaultValue: "'available'" },
      { name: 'is_available', type: 'TINYINT(1)', defaultValue: '1' },
      { name: 'hourly_rate', type: 'DECIMAL(6, 2)', nullable: false },
      { name: 'charger_type', type: 'VARCHAR(50)', defaultValue: "'None'" },
      { name: 'sensor_id', type: 'VARCHAR(50)', isForeign: true, references: 'spot_sensors(sensor_id)' },
      { name: 'last_updated', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  },
  {
    name: 'spot_sensors',
    comment: 'IoT ultrasonic/magnetic hardware reporting spot state',
    columns: [
      { name: 'sensor_id', type: 'VARCHAR(50)', isPrimary: true },
      { name: 'spot_id', type: 'INT', isForeign: true, references: 'parking_spots(id)' },
      { name: 'sensor_type', type: 'VARCHAR(50)', defaultValue: "'Ultrasonic'" },
      { name: 'battery_percent', type: 'INT', defaultValue: '95' },
      { name: 'signal_strength_dbm', type: 'INT', defaultValue: '-65' },
      { name: 'detected_distance_cm', type: 'INT', defaultValue: '240' },
      { name: 'status', type: 'ENUM("online", "weak_battery", "offline")', defaultValue: "'online'" },
      { name: 'last_ping_time', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  },
  {
    name: 'reservations',
    comment: 'Customer spot bookings, duration & access tokens',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true },
      { name: 'booking_code', type: 'VARCHAR(20)', nullable: false },
      { name: 'user_id', type: 'INT', isForeign: true, references: 'users(id)' },
      { name: 'spot_id', type: 'INT', isForeign: true, references: 'parking_spots(id)' },
      { name: 'lot_id', type: 'INT', isForeign: true, references: 'parking_lots(id)' },
      { name: 'vehicle_plate', type: 'VARCHAR(20)', nullable: false },
      { name: 'vehicle_model', type: 'VARCHAR(100)' },
      { name: 'start_time', type: 'DATETIME', nullable: false },
      { name: 'end_time', type: 'DATETIME', nullable: false },
      { name: 'duration_hours', type: 'INT', nullable: false },
      { name: 'total_amount', type: 'DECIMAL(8, 2)', nullable: false },
      { name: 'status', type: 'ENUM("active", "completed", "cancelled")', defaultValue: "'active'" },
      { name: 'qr_token', type: 'VARCHAR(128)', nullable: false },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  },
  {
    name: 'payments',
    comment: 'Transaction records and payment receipts',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', isPrimary: true },
      { name: 'reservation_id', type: 'VARCHAR(64)', isForeign: true, references: 'reservations(id)' },
      { name: 'amount', type: 'DECIMAL(8, 2)', nullable: false },
      { name: 'payment_method', type: 'VARCHAR(50)', defaultValue: "'Credit Card'" },
      { name: 'status', type: 'VARCHAR(30)', defaultValue: "'PAID'" },
      { name: 'transaction_ref', type: 'VARCHAR(100)', nullable: false },
      { name: 'paid_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  }
];

export class MySqlDatabaseEngine {
  private tables: Record<string, Record<string, any>[]> = {
    users: [],
    parking_lots: [],
    floors: [],
    parking_spots: [],
    spot_sensors: [],
    reservations: [],
    payments: []
  };

  constructor() {
    this.initDefaultUsers();
  }

  private initDefaultUsers() {
    this.tables.users = [
      { id: 1, full_name: 'Karthik Sundaram', email: 'karthik.sundaram@example.com', phone: '+91 98421 23456', membership_tier: 'premium', created_at: '2026-01-15 08:30:00' },
      { id: 2, full_name: 'Priya Natarajan', email: 'priya.n@example.com', phone: '+91 94432 87654', membership_tier: 'standard', created_at: '2026-02-10 14:15:00' },
      { id: 3, full_name: 'Vigneshwaran M', email: 'vignesh.m@example.com', phone: '+91 97890 12345', membership_tier: 'vip', created_at: '2026-03-01 10:00:00' }
    ];
  }

  public syncFromAppState(
    lots: ParkingLot[],
    floors: Floor[],
    spots: ParkingSpot[],
    reservations: Reservation[],
    sensors: SpotSensor[]
  ) {
    this.tables.parking_lots = lots.map(l => ({
      id: l.id,
      name: l.name,
      tagline: l.tagline,
      address: l.address,
      city: l.city,
      latitude: l.lat,
      longitude: l.lng,
      hourly_rate: l.hourlyRate,
      total_spots: l.totalSpots,
      operating_hours: l.operatingHours,
      has_cctv: l.hasCctv ? 1 : 0,
      has_covered_roof: l.hasCoveredRoof ? 1 : 0
    }));

    this.tables.floors = floors.map(f => ({
      id: f.id,
      lot_id: f.lotId,
      floor_number: f.floorNumber,
      floor_name: f.floorName,
      level_code: f.levelCode,
      total_spots: f.totalSpots
    }));

    this.tables.parking_spots = spots.map(s => ({
      id: s.id,
      lot_id: s.lotId,
      floor_id: s.floorId,
      spot_number: s.spotNumber,
      row_letter: s.rowLetter,
      column_number: s.columnNumber,
      spot_type: s.spotType,
      status: s.status,
      is_available: s.isAvailable ? 1 : 0,
      hourly_rate: s.hourlyRate,
      charger_type: s.chargerType || 'None',
      sensor_id: s.sensorId,
      last_updated: s.lastUpdated
    }));

    this.tables.spot_sensors = sensors.map(s => ({
      sensor_id: s.sensorId,
      spot_id: s.spotId,
      sensor_type: s.sensorType,
      battery_percent: s.batteryPercent,
      signal_strength_dbm: s.signalStrengthDbm,
      detected_distance_cm: s.detectedDistanceCm ?? 240,
      status: s.status,
      last_ping_time: s.lastPingTime
    }));

    this.tables.reservations = reservations.map(r => ({
      id: r.id,
      booking_code: r.bookingCode,
      user_id: r.userId,
      spot_id: r.spotId,
      lot_id: r.lotId,
      vehicle_plate: r.vehiclePlate,
      vehicle_model: r.vehicleModel,
      start_time: r.startTime,
      end_time: r.endTime,
      duration_hours: r.durationHours,
      total_amount: r.totalAmount,
      status: r.status,
      qr_token: r.qrToken,
      created_at: r.createdAt
    }));

    this.tables.payments = reservations.map((r, i) => ({
      id: i + 1,
      reservation_id: r.id,
      amount: r.totalAmount,
      payment_method: 'UPI (GPay / PhonePe) / FASTag',
      status: r.status === 'cancelled' ? 'REFUNDED' : 'PAID',
      transaction_ref: `TXN-UPI-${r.bookingCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      paid_at: r.createdAt
    }));
  }

  public getTableNames(): string[] {
    return Object.keys(this.tables);
  }

  public getTableData(tableName: string): Record<string, any>[] {
    return this.tables[tableName] || [];
  }

  public executeQuery(sqlQuery: string): QueryResult {
    const startTime = performance.now();
    const trimmed = sqlQuery.trim().replace(/;$/, '');

    try {
      if (!trimmed) {
        return {
          query: sqlQuery,
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs: 0
        };
      }

      const upper = trimmed.toUpperCase();

      // SHOW TABLES
      if (upper === 'SHOW TABLES' || upper.startsWith('SHOW TABLES')) {
        const rows = this.getTableNames().map(t => ({ Tables_in_smart_parking: t }));
        const execTime = Number((performance.now() - startTime).toFixed(2));
        return {
          query: sqlQuery,
          columns: ['Tables_in_smart_parking'],
          rows,
          rowCount: rows.length,
          executionTimeMs: execTime
        };
      }

      // DESCRIBE / DESC
      if (upper.startsWith('DESC ') || upper.startsWith('DESCRIBE ')) {
        const parts = trimmed.split(/\s+/);
        const tableName = parts[1]?.toLowerCase();
        const def = MYSQL_TABLE_DEFINITIONS.find(t => t.name.toLowerCase() === tableName);
        if (!def) {
          throw new Error(`Table 'smart_parking.${tableName}' doesn't exist`);
        }
        const rows = def.columns.map(c => ({
          Field: c.name,
          Type: c.type,
          Null: c.nullable ? 'YES' : 'NO',
          Key: c.isPrimary ? 'PRI' : c.isForeign ? 'MUL' : '',
          Default: c.defaultValue ?? (c.nullable ? 'NULL' : ''),
          Extra: c.type.includes('AUTO_INCREMENT') ? 'auto_increment' : ''
        }));
        return {
          query: sqlQuery,
          columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
          rows,
          rowCount: rows.length,
          executionTimeMs: Number((performance.now() - startTime).toFixed(2))
        };
      }

      // SELECT statement execution
      if (upper.startsWith('SELECT')) {
        return this.handleSelectQuery(trimmed, startTime);
      }

      // INSERT statement execution
      if (upper.startsWith('INSERT INTO')) {
        return this.handleInsertQuery(trimmed, startTime);
      }

      // UPDATE statement execution
      if (upper.startsWith('UPDATE')) {
        return this.handleUpdateQuery(trimmed, startTime);
      }

      // DELETE statement execution
      if (upper.startsWith('DELETE FROM')) {
        return this.handleDeleteQuery(trimmed, startTime);
      }

      throw new Error(`Command not directly supported in playground. Try SELECT, DESCRIBE, SHOW TABLES, INSERT, UPDATE, or use the pre-built templates.`);
    } catch (err: any) {
      return {
        query: sqlQuery,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
        error: err.message || 'SQL Syntax Error'
      };
    }
  }

  private handleSelectQuery(sql: string, startTime: number): QueryResult {
    // Regex parsing for basic SELECT ... FROM table [JOIN table2 ON ...] [WHERE ...] [ORDER BY ...] [LIMIT ...]
    const fromMatch = sql.match(/FROM\s+([a-zA-Z0-9_]+)(?:\s+AS\s+([a-zA-Z0-9_]+)|\s+([a-zA-Z0-9_]+))?/i);
    if (!fromMatch) {
      throw new Error("Missing FROM clause in SELECT statement");
    }

    const mainTable = fromMatch[1].toLowerCase();
    const mainAlias = fromMatch[2] || fromMatch[3] || mainTable;

    if (!this.tables[mainTable]) {
      throw new Error(`Table 'smart_parking.${mainTable}' doesn't exist`);
    }

    let rows: Record<string, any>[] = this.tables[mainTable].map(r => ({ ...r }));

    // Check for JOIN
    const joinMatch = sql.match(/JOIN\s+([a-zA-Z0-9_]+)(?:\s+AS\s+([a-zA-Z0-9_]+)|\s+([a-zA-Z0-9_]+))?\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/i);
    if (joinMatch) {
      const joinTable = joinMatch[1].toLowerCase();
      const joinAlias = joinMatch[2] || joinMatch[3] || joinTable;
      const leftColRaw = joinMatch[4];
      const rightColRaw = joinMatch[5];

      if (this.tables[joinTable]) {
        const joinedRows: Record<string, any>[] = [];
        const leftKey = leftColRaw.includes('.') ? leftColRaw.split('.')[1] : leftColRaw;
        const rightKey = rightColRaw.includes('.') ? rightColRaw.split('.')[1] : rightColRaw;

        for (const mainRow of rows) {
          const matching = this.tables[joinTable].filter(jRow => {
            return String(mainRow[leftKey] ?? mainRow[rightKey]) === String(jRow[rightKey] ?? jRow[leftKey]);
          });

          for (const matchRow of matching) {
            const combined: Record<string, any> = {};
            for (const [k, v] of Object.entries(mainRow)) combined[`${mainAlias}.${k}`] = v;
            for (const [k, v] of Object.entries(matchRow)) combined[`${joinAlias}.${k}`] = v;
            // Also keep unprefixed if unique
            Object.assign(combined, mainRow, matchRow);
            joinedRows.push(combined);
          }
        }
        rows = joinedRows;
      }
    }

    // WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.*?)(?:\s+ORDER\s+BY|\s+GROUP\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const condition = whereMatch[1].trim();
      rows = rows.filter(row => this.evaluateCondition(condition, row));
    }

    // ORDER BY
    const orderMatch = sql.match(/ORDER\s+BY\s+([a-zA-Z0-9_.]+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const colName = orderMatch[1].includes('.') ? orderMatch[1].split('.')[1] : orderMatch[1];
      const dir = (orderMatch[2] || 'ASC').toUpperCase();
      rows.sort((a, b) => {
        const valA = a[colName] ?? a[orderMatch[1]];
        const valB = b[colName] ?? b[orderMatch[1]];
        if (valA === valB) return 0;
        if (dir === 'DESC') return valA < valB ? 1 : -1;
        return valA > valB ? 1 : -1;
      });
    }

    // LIMIT
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, limitVal);
    }

    // Projection (SELECT ...)
    const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/i);
    let selectFields = selectMatch ? selectMatch[1].trim() : '*';

    let finalRows: Record<string, any>[] = [];
    let columns: string[] = [];

    if (selectFields === '*' || selectFields.includes('.*')) {
      if (rows.length > 0) {
        columns = Object.keys(rows[0]).filter(k => !k.includes('.'));
        if (columns.length === 0) columns = Object.keys(rows[0]);
      } else {
        const def = MYSQL_TABLE_DEFINITIONS.find(t => t.name === mainTable);
        columns = def ? def.columns.map(c => c.name) : ['id'];
      }
      finalRows = rows.map(r => {
        const res: Record<string, any> = {};
        columns.forEach(col => { res[col] = r[col]; });
        return res;
      });
    } else {
      const fieldTokens = selectFields.split(',').map(f => f.trim());
      columns = fieldTokens.map(f => {
        const asMatch = f.match(/AS\s+([a-zA-Z0-9_]+)/i);
        if (asMatch) return asMatch[1];
        if (f.includes('.')) return f.split('.')[1];
        return f;
      });

      finalRows = rows.map(r => {
        const out: Record<string, any> = {};
        fieldTokens.forEach((token, idx) => {
          const colAlias = columns[idx];
          const rawCol = token.replace(/AS\s+[a-zA-Z0-9_]+/i, '').trim();
          const cleanCol = rawCol.includes('.') ? rawCol.split('.')[1] : rawCol;
          out[colAlias] = r[rawCol] ?? r[cleanCol] ?? (rawCol.includes('COUNT(') ? rows.length : null);
        });
        return out;
      });
    }

    return {
      query: sql,
      columns,
      rows: finalRows,
      rowCount: finalRows.length,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };
  }

  private evaluateCondition(condition: string, row: Record<string, any>): boolean {
    const parts = condition.split(/\s+AND\s+/i);
    for (const part of parts) {
      const eqMatch = part.match(/([a-zA-Z0-9_.]+)\s*(=|!=|<>|LIKE|>|<|>=|<=)\s*(.*)/i);
      if (eqMatch) {
        const colRaw = eqMatch[1].trim();
        const col = colRaw.includes('.') ? colRaw.split('.')[1] : colRaw;
        const op = eqMatch[2].trim();
        let target = eqMatch[3].trim().replace(/^['"]|['"]$/g, '');

        const rowVal = row[colRaw] ?? row[col];

        if (op === '=') {
          if (String(rowVal).toLowerCase() !== target.toLowerCase()) return false;
        } else if (op === '!=' || op === '<>') {
          if (String(rowVal).toLowerCase() === target.toLowerCase()) return false;
        } else if (op === '>') {
          if (Number(rowVal) <= Number(target)) return false;
        } else if (op === '<') {
          if (Number(rowVal) >= Number(target)) return false;
        } else if (op === '>=') {
          if (Number(rowVal) < Number(target)) return false;
        } else if (op === '<=') {
          if (Number(rowVal) > Number(target)) return false;
        } else if (op.toUpperCase() === 'LIKE') {
          const regex = new RegExp('^' + target.replace(/%/g, '.*') + '$', 'i');
          if (!regex.test(String(rowVal))) return false;
        }
      }
    }
    return true;
  }

  private handleInsertQuery(sql: string, startTime: number): QueryResult {
    const insertMatch = sql.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\)/i);
    if (!insertMatch) {
      throw new Error("Syntax error in INSERT statement. Expected INSERT INTO <table> (<cols>) VALUES (<vals>)");
    }
    const tableName = insertMatch[1].toLowerCase();
    const cols = insertMatch[2].split(',').map(c => c.trim());
    const vals = insertMatch[3].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));

    if (!this.tables[tableName]) {
      throw new Error(`Table 'smart_parking.${tableName}' doesn't exist`);
    }

    const newRow: Record<string, any> = {};
    cols.forEach((col, idx) => {
      newRow[col] = vals[idx] !== undefined ? vals[idx] : null;
    });

    if (!newRow.id) {
      newRow.id = this.tables[tableName].length + 1;
    }

    this.tables[tableName].push(newRow);

    return {
      query: sql,
      columns: ['status', 'affected_rows', 'insert_id'],
      rows: [{ status: 'Query OK', affected_rows: 1, insert_id: newRow.id }],
      rowCount: 1,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };
  }

  private handleUpdateQuery(sql: string, startTime: number): QueryResult {
    const updateMatch = sql.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.*?)(?:\s+WHERE\s+(.*))?$/i);
    if (!updateMatch) {
      throw new Error("Syntax error in UPDATE statement");
    }
    const tableName = updateMatch[1].toLowerCase();
    const setClause = updateMatch[2];
    const whereClause = updateMatch[3];

    if (!this.tables[tableName]) {
      throw new Error(`Table 'smart_parking.${tableName}' doesn't exist`);
    }

    const assignments = setClause.split(',').map(a => {
      const [col, val] = a.split('=').map(s => s.trim());
      return { col, val: val.replace(/^['"]|['"]$/g, '') };
    });

    let affected = 0;
    for (const row of this.tables[tableName]) {
      if (!whereClause || this.evaluateCondition(whereClause, row)) {
        for (const assign of assignments) {
          row[assign.col] = assign.val;
        }
        affected++;
      }
    }

    return {
      query: sql,
      columns: ['status', 'rows_matched', 'changed'],
      rows: [{ status: 'Query OK', rows_matched: affected, changed: affected }],
      rowCount: 1,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };
  }

  private handleDeleteQuery(sql: string, startTime: number): QueryResult {
    const deleteMatch = sql.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.*))?$/i);
    if (!deleteMatch) {
      throw new Error("Syntax error in DELETE statement");
    }
    const tableName = deleteMatch[1].toLowerCase();
    const whereClause = deleteMatch[2];

    if (!this.tables[tableName]) {
      throw new Error(`Table 'smart_parking.${tableName}' doesn't exist`);
    }

    const initialLen = this.tables[tableName].length;
    if (!whereClause) {
      this.tables[tableName] = [];
    } else {
      this.tables[tableName] = this.tables[tableName].filter(row => !this.evaluateCondition(whereClause, row));
    }
    const affected = initialLen - this.tables[tableName].length;

    return {
      query: sql,
      columns: ['status', 'affected_rows'],
      rows: [{ status: 'Query OK', affected_rows: affected }],
      rowCount: 1,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };
  }

  public generateFullSqlDump(): string {
    let sql = `-- =========================================================================
-- SMART PARKING RESERVATION SYSTEM - MYSQL 8.0 DATABASE SCHEMA & SEED DATA
-- Location: Coimbatore, Tamil Nadu, India
-- Currency: Indian Rupee (INR / ₹) with 18% GST (CGST/SGST)
-- Generated by ParkPulse Engine
-- Target Database: MySQL / MariaDB (InnoDB Engine, UTF8MB4)
-- =========================================================================

CREATE DATABASE IF NOT EXISTS \`smart_parking\`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`smart_parking\`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS \`payments\`;
DROP TABLE IF EXISTS \`reservations\`;
DROP TABLE IF EXISTS \`spot_sensors\`;
DROP TABLE IF EXISTS \`parking_spots\`;
DROP TABLE IF EXISTS \`floors\`;
DROP TABLE IF EXISTS \`parking_lots\`;
DROP TABLE IF EXISTS \`users\`;
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------------------
-- 1. Table: users
-- -------------------------------------------------------------------------
CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone\` VARCHAR(20) NOT NULL,
  \`membership_tier\` ENUM('standard', 'premium', 'vip') DEFAULT 'standard',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_users_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 2. Table: parking_lots
-- -------------------------------------------------------------------------
CREATE TABLE \`parking_lots\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`tagline\` VARCHAR(255),
  \`address\` VARCHAR(255) NOT NULL,
  \`city\` VARCHAR(100) DEFAULT 'Downtown',
  \`latitude\` DECIMAL(10, 8) NOT NULL,
  \`longitude\` DECIMAL(11, 8) NOT NULL,
  \`hourly_rate\` DECIMAL(6, 2) NOT NULL,
  \`total_spots\` INT NOT NULL,
  \`operating_hours\` VARCHAR(100) DEFAULT '24/7 Access',
  \`has_cctv\` TINYINT(1) DEFAULT 1,
  \`has_covered_roof\` TINYINT(1) DEFAULT 1,
  INDEX \`idx_lots_coords\` (\`latitude\`, \`longitude\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 3. Table: floors
-- -------------------------------------------------------------------------
CREATE TABLE \`floors\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`lot_id\` INT NOT NULL,
  \`floor_number\` INT NOT NULL,
  \`floor_name\` VARCHAR(50) NOT NULL,
  \`level_code\` VARCHAR(10) NOT NULL,
  \`total_spots\` INT NOT NULL,
  FOREIGN KEY (\`lot_id\`) REFERENCES \`parking_lots\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_floors_lot\` (\`lot_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 4. Table: parking_spots
-- -------------------------------------------------------------------------
CREATE TABLE \`parking_spots\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`lot_id\` INT NOT NULL,
  \`floor_id\` INT NOT NULL,
  \`spot_number\` VARCHAR(20) NOT NULL,
  \`row_letter\` CHAR(2) NOT NULL,
  \`column_number\` INT NOT NULL,
  \`spot_type\` ENUM('standard', 'ev', 'accessible', 'vip', 'motorcycle') DEFAULT 'standard',
  \`status\` ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
  \`is_available\` TINYINT(1) DEFAULT 1,
  \`hourly_rate\` DECIMAL(6, 2) NOT NULL,
  \`charger_type\` VARCHAR(50) DEFAULT 'None',
  \`sensor_id\` VARCHAR(50),
  \`last_updated\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`lot_id\`) REFERENCES \`parking_lots\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`floor_id\`) REFERENCES \`floors\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_spots_status\` (\`is_available\`, \`spot_type\`),
  INDEX \`idx_spots_lot_floor\` (\`lot_id\`, \`floor_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 5. Table: spot_sensors (IoT ultrasonic & camera nodes)
-- -------------------------------------------------------------------------
CREATE TABLE \`spot_sensors\` (
  \`sensor_id\` VARCHAR(50) PRIMARY KEY,
  \`spot_id\` INT NOT NULL,
  \`sensor_type\` VARCHAR(50) DEFAULT 'Ultrasonic',
  \`battery_percent\` INT DEFAULT 95,
  \`signal_strength_dbm\` INT DEFAULT -65,
  \`detected_distance_cm\` INT DEFAULT 240,
  \`status\` ENUM('online', 'weak_battery', 'offline') DEFAULT 'online',
  \`last_ping_time\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`spot_id\`) REFERENCES \`parking_spots\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_sensors_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 6. Table: reservations
-- -------------------------------------------------------------------------
CREATE TABLE \`reservations\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`booking_code\` VARCHAR(20) NOT NULL UNIQUE,
  \`user_id\` INT NOT NULL,
  \`spot_id\` INT NOT NULL,
  \`lot_id\` INT NOT NULL,
  \`vehicle_plate\` VARCHAR(20) NOT NULL,
  \`vehicle_model\` VARCHAR(100),
  \`start_time\` DATETIME NOT NULL,
  \`end_time\` DATETIME NOT NULL,
  \`duration_hours\` INT NOT NULL,
  \`total_amount\` DECIMAL(8, 2) NOT NULL,
  \`status\` ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  \`qr_token\` VARCHAR(128) NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`),
  FOREIGN KEY (\`spot_id\`) REFERENCES \`parking_spots\` (\`id\`),
  FOREIGN KEY (\`lot_id\`) REFERENCES \`parking_lots\` (\`id\`),
  INDEX \`idx_reservations_status\` (\`status\`),
  INDEX \`idx_reservations_user\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 7. Table: payments
-- -------------------------------------------------------------------------
CREATE TABLE \`payments\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`reservation_id\` VARCHAR(64) NOT NULL,
  \`amount\` DECIMAL(8, 2) NOT NULL,
  \`payment_method\` VARCHAR(50) DEFAULT 'Credit Card',
  \`status\` VARCHAR(30) DEFAULT 'PAID',
  \`transaction_ref\` VARCHAR(100) NOT NULL,
  \`paid_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`reservation_id\`) REFERENCES \`reservations\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- MYSQL TRIGGERS FOR REAL-TIME OCCUPANCY INTEGRITY
-- -------------------------------------------------------------------------

DELIMITER $$

-- Trigger 1: When a reservation is inserted, mark the parking spot as reserved
CREATE TRIGGER \`trg_after_reservation_created\`
AFTER INSERT ON \`reservations\`
FOR EACH ROW
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE \`parking_spots\`
    SET \`status\` = 'reserved', \`is_available\` = 0, \`last_updated\` = NOW()
    WHERE \`id\` = NEW.spot_id;
  END IF;
END$$

-- Trigger 2: When reservation is cancelled or completed, release the spot
CREATE TRIGGER \`trg_after_reservation_updated\`
AFTER UPDATE ON \`reservations\`
FOR EACH ROW
BEGIN
  IF NEW.status IN ('completed', 'cancelled') AND OLD.status = 'active' THEN
    UPDATE \`parking_spots\`
    SET \`status\` = 'available', \`is_available\` = 1, \`last_updated\` = NOW()
    WHERE \`id\` = NEW.spot_id;
  END IF;
END$$

-- Trigger 3: IoT Sensor Telemetry Ping updates spot real-time status
CREATE TRIGGER \`trg_after_sensor_telemetry_ping\`
AFTER UPDATE ON \`spot_sensors\`
FOR EACH ROW
BEGIN
  -- If detected distance < 80cm, a vehicle has parked physically
  IF NEW.detected_distance_cm < 80 THEN
    UPDATE \`parking_spots\`
    SET \`status\` = 'occupied', \`is_available\` = 0, \`last_updated\` = NOW()
    WHERE \`id\` = NEW.spot_id AND \`status\` != 'reserved';
  ELSEIF NEW.detected_distance_cm >= 180 THEN
    UPDATE \`parking_spots\`
    SET \`status\` = 'available', \`is_available\` = 1, \`last_updated\` = NOW()
    WHERE \`id\` = NEW.spot_id AND \`status\` = 'occupied';
  END IF;
END$$

DELIMITER ;

-- -------------------------------------------------------------------------
-- REAL-TIME SPATIAL VIEW: Available Spots Near User
-- -------------------------------------------------------------------------
CREATE OR REPLACE VIEW \`v_live_available_spots\` AS
SELECT
  s.id AS spot_id,
  s.spot_number,
  s.spot_type,
  s.hourly_rate,
  s.charger_type,
  f.floor_name,
  f.level_code,
  l.id AS lot_id,
  l.name AS lot_name,
  l.address,
  l.latitude,
  l.longitude
FROM \`parking_spots\` s
JOIN \`floors\` f ON s.floor_id = f.id
JOIN \`parking_lots\` l ON s.lot_id = l.id
WHERE s.is_available = 1;

-- -------------------------------------------------------------------------
-- SEED DATA INSERTIONS
-- -------------------------------------------------------------------------
`;

    // Dump tables data
    for (const [tblName, rows] of Object.entries(this.tables)) {
      if (rows.length === 0) continue;
      sql += `\n-- Data for \`${tblName}\`\n`;
      for (const row of rows) {
        const keys = Object.keys(row).map(k => `\`${k}\``).join(', ');
        const vals = Object.values(row).map(v => {
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'number') return v;
          return `'${String(v).replace(/'/g, "''")}'`;
        }).join(', ');
        sql += `INSERT INTO \`${tblName}\` (${keys}) VALUES (${vals});\n`;
      }
    }

    sql += `\n-- =========================================================================\n-- END OF DUMP\n-- =========================================================================\n`;
    return sql;
  }
}

export const mySqlEngine = new MySqlDatabaseEngine();
