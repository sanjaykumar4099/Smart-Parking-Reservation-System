import React, { useState } from 'react';
import { X, Code2, Database, Download, Copy, Check, FileText, Layers } from 'lucide-react';
import { mySqlEngine } from '../services/mysqlEngine';

interface CodeArchitectureModalProps {
  onClose: () => void;
}

export const CodeArchitectureModal: React.FC<CodeArchitectureModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'html' | 'css' | 'mysql' | 'php'>('overview');
  const [copied, setCopied] = useState(false);

  const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Parking Reservation System</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <div class="logo">ParkPulse <span>MySQL 8.0</span></div>
    <nav class="nav">
      <a href="#radar">Near Me</a>
      <a href="#map">Floor Map</a>
      <a href="#passes">Passes</a>
      <a href="#sql">Database</a>
    </nav>
  </header>

  <main class="container">
    <!-- User Geolocation & Radar -->
    <section class="hero-radar" id="radar">
      <h1>Real-Time Spot Availability Near You</h1>
      <p>Locate available bays, EV chargers, and automated barriers.</p>
      <div class="radar-controls">
        <button id="btn-gps" onclick="detectUserLocation()">Use My GPS</button>
        <div id="location-display">Peelamedu / Gandhipuram, Coimbatore (0.4 km away)</div>
      </div>
      <div class="stats-bar">
        <div class="stat-card">Free Spots: <strong id="free-count">48</strong></div>
        <div class="stat-card">EV Ready: <strong id="ev-count">16</strong></div>
        <div class="stat-card">Status: <strong class="badge-live">MySQL Live</strong></div>
      </div>
    </section>

    <!-- Interactive Parking Floor Map -->
    <section class="parking-deck" id="map">
      <h2>Deck Floor Plan & Individual Bays</h2>
      <div class="lane aisle">ENTRY GATE &rarr; AISLE DRIVEWAY &rarr; EXIT RAMP</div>
      <div class="bays-grid" id="spots-container">
        <!-- Rendered dynamically from MySQL SELECT * FROM parking_spots -->
      </div>
    </section>

    <!-- Reservation Form Modal -->
    <section class="booking-section">
      <h3>Quick Spot Reservation (Coimbatore)</h3>
      <form id="reservation-form" action="reserve.php" method="POST">
        <input type="hidden" name="spot_id" value="8" />
        <label>License Plate: <input type="text" name="vehicle_plate" required placeholder="TN-38-BZ-4921" /></label>
        <label>Duration: 
          <select name="duration_hours">
            <option value="1">1 Hour</option>
            <option value="2" selected>2 Hours</option>
            <option value="4">4 Hours</option>
          </select>
        </label>
        <button type="submit" class="btn-primary">Confirm & Book (MySQL INSERT)</button>
      </form>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>`;

  const standaloneCss = `/* ==========================================================
   SMART PARKING SYSTEM - PURE CSS STYLESHEET (style.css)
   Clean, high-contrast, dark-mode automotive aesthetic
   ========================================================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #020617;
  color: #f8fafc;
  line-height: 1.5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: #10b981;
}

.logo span {
  font-size: 0.75rem;
  background: #064e3b;
  color: #34d399;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  margin-left: 0.5rem;
}

.nav a {
  color: #94a3b8;
  text-decoration: none;
  margin-left: 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.2s;
}

.nav a:hover {
  color: #10b981;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.hero-radar {
  background: linear-gradient(135deg, #0f172a, #064e3b);
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-card {
  background: rgba(2, 6, 23, 0.7);
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #1e293b;
}

.bays-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.bay {
  border: 2px solid #10b981;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 0.75rem;
  padding: 0.75rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.bay.occupied {
  border-color: #e11d48;
  background: rgba(225, 29, 72, 0.1);
  cursor: not-allowed;
}

.btn-primary {
  background-color: #10b981;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  border-radius: 0.75rem;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #059669;
}`;

  const phpBackendCode = `<?php
/**
 * Smart Parking Reservation System - PHP & MySQL Integration
 * Connects pure HTML/CSS forms directly with MySQL database.
 */

$host = '127.0.0.1';
$db   = 'smart_parking';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
     throw new \\PDOException($e->getMessage(), (int)$e->getCode());
}

// 1. Fetch available parking spots near coordinates
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_spots') {
    $stmt = $pdo->prepare("SELECT * FROM v_live_available_spots WHERE lot_id = :lot_id");
    $stmt->execute(['lot_id' => $_GET['lot_id'] ?? 1]);
    $spots = $stmt->fetchAll();
    header('Content-Type: application/json');
    echo json_encode($spots);
    exit;
}

// 2. Handle spot reservation (INSERT into reservations & trigger spot status change)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $spot_id = (int)$_POST['spot_id'];
    $vehicle_plate = trim($_POST['vehicle_plate']);
    $duration = (int)$_POST['duration_hours'];
    $booking_code = 'PK-' . rand(1000, 9999) . '-A';
    $qr_token = md5($booking_code . time());

    // Transaction to safely book spot
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO reservations 
            (id, booking_code, user_id, spot_id, lot_id, vehicle_plate, start_time, end_time, duration_hours, total_amount, status, qr_token) 
            VALUES (UUID(), :code, 1, :spot_id, 1, :plate, NOW(), DATE_ADD(NOW(), INTERVAL :dur HOUR), :dur, :amount, 'active', :token)");

        $amount = 40.00 * $duration + 5.00; // Rate in INR (₹)
        $stmt->execute([
            'code' => $booking_code,
            'spot_id' => $spot_id,
            'plate' => $vehicle_plate,
            'dur' => $duration,
            'amount' => $amount,
            'token' => $qr_token
        ]);

        // Explicitly update spot is_available = 0 (in addition to MySQL trigger)
        $pdo->prepare("UPDATE parking_spots SET status = 'reserved', is_available = 0 WHERE id = :id")->execute(['id' => $spot_id]);

        $pdo->commit();
        echo "Reservation Successful! Your Booking Code is " . htmlspecialchars($booking_code);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo "Reservation Failed: " . $e->getMessage();
    }
}
?>`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const fullDump = mySqlEngine.generateFullSqlDump();
    const blob = new Blob([fullDump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart_parking.sql';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                HTML + CSS + MySQL System Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Complete technical blueprint and source files for local deployment with LAMP / XAMPP / Node
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 bg-slate-950/40 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'html'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            index.html
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'css'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            style.css
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'mysql'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            smart_parking.sql
          </button>
          <button
            onClick={() => setActiveTab('php')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'php'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            PHP / Node Connector
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  How HTML, CSS and MySQL Work Together:
                </h4>
                <p className="leading-relaxed">
                  This system satisfies the requirement for a smart parking reservation system using semantic HTML, pure CSS layout rules, and MySQL relational database tables:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-300">
                  <li>
                    <strong className="text-white">HTML5 (Presentation Structure):</strong> Provides the semantic containers for the parking radar, multi-floor driving aisles, individual bays, booking forms, and digital QR ticket passes.
                  </li>
                  <li>
                    <strong className="text-white">CSS3 (Styling & Visual Feedback):</strong> Styles the dynamic floor plan, real-time availability gauges, green/red/amber status indicators, and responsive card layouts.
                  </li>
                  <li>
                    <strong className="text-white">MySQL 8.0 (Relational Database):</strong> Stores garages, floors, bays, ultrasonic IoT sensors, drivers, reservations, and transactions with foreign key integrity and automated status triggers.
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-1">1. XAMPP / LAMP</span>
                  <p className="text-[11px] text-slate-400">
                    Place <code className="text-emerald-400">index.html</code>, <code className="text-emerald-400">style.css</code>, and <code className="text-emerald-400">api.php</code> into <code className="text-slate-300">htdocs/</code>.
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-1">2. Import MySQL</span>
                  <p className="text-[11px] text-slate-400">
                    Open phpMyAdmin, create database <code className="text-emerald-400">smart_parking</code>, and import <code className="text-emerald-400">smart_parking.sql</code>.
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-1">3. Live Testing</span>
                  <p className="text-[11px] text-slate-400">
                    Visit <code className="text-slate-300">http://localhost/smart_parking/</code> to test live reservations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">index.html (Semantic HTML5 Document)</span>
                <button
                  onClick={() => handleCopy(standaloneHtml)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-80">
                {standaloneHtml}
              </pre>
            </div>
          )}

          {activeTab === 'css' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">style.css (Pure CSS3 Stylesheet)</span>
                <button
                  onClick={() => handleCopy(standaloneCss)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto max-h-80">
                {standaloneCss}
              </pre>
            </div>
          )}

          {activeTab === 'mysql' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">smart_parking.sql (MySQL 8.0 DDL & Seed)</span>
                <button
                  onClick={() => handleCopy(mySqlEngine.generateFullSqlDump())}
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-80">
                {mySqlEngine.generateFullSqlDump()}
              </pre>
            </div>
          )}

          {activeTab === 'php' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400">api.php (MySQL PDO Backend Bridge)</span>
                <button
                  onClick={() => handleCopy(phpBackendCode)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy PHP'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto max-h-80">
                {phpBackendCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Export ready for submission or production hosting.
          </span>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download smart_parking.sql</span>
          </button>
        </div>
      </div>
    </div>
  );
};
