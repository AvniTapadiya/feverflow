import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Activity, Thermometer, CheckCircle, AlertTriangle, Building2, 
  TrendingUp, Clock, ShieldAlert, LogOut, UserPlus, Filter, Search, 
  Calendar, FileText, ChevronRight, RefreshCw, Eye, Check, X, ArrowRight,
  Info, Bell, Settings, Award, Layers, Sparkles, AlertCircle, Play
} from 'lucide-react';

// --- INITIAL DEMO DATA GENERATOR ---
const GENERATE_INITIAL_DATA = () => {
  const rooms = Array.from({ length: 74 }, (_, i) => `Room ${101 + i}`);
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa', 'Edward', 'Deborah'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
  
  const todayStr = new Date().toISOString().split('T')[0];
  const getDateStr = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const patients = [];
  const logs = [];

  // Generate 74 active patients occupying all 74 rooms initially
  for (let i = 0; i < 74; i++) {
    const id = `FF-PT-${1000 + i}`;
    const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    const age = 22 + ((i * 7) % 55);
    const gender = i % 2 === 0 ? 'Male' : 'Female';
    const room = rooms[i];
    const admissionOffset = - (3 + (i % 8));
    const admissionDate = getDateStr(admissionOffset);

    let status = 'Active';
    let tempHistory = [];
    let nurseVisitToday = false;
    let doctorVisitToday = false;
    let doctorDecision = null; // 'approved', 'deferred', null
    let doctorNotes = '';

    // Create realistic history
    // Scenario A: 8 patients qualify for 3-day fever free right now!
    if (i < 8) {
      tempHistory = [
        { date: getDateStr(-3), temp: 36.8, time: '08:30', recordedBy: 'Nurse Clara' },
        { date: getDateStr(-2), temp: 37.0, time: '09:00', recordedBy: 'Nurse Clara' },
        { date: getDateStr(-1), temp: 36.6, time: '08:15', recordedBy: 'Nurse Mark' },
        { date: todayStr, temp: 36.7, time: '08:45', recordedBy: 'Nurse Clara' }
      ];
      nurseVisitToday = true;
      doctorVisitToday = i % 2 === 0; // some visited today, some pending
      status = 'Discharge Review';
    } 
    // Scenario B: 4 patients already doctor approved, pending admin discharge
    else if (i >= 8 && i < 12) {
      tempHistory = [
        { date: getDateStr(-3), temp: 37.1, time: '08:00', recordedBy: 'Nurse Sarah' },
        { date: getDateStr(-2), temp: 36.9, time: '08:30', recordedBy: 'Nurse Sarah' },
        { date: getDateStr(-1), temp: 36.5, time: '09:10', recordedBy: 'Nurse Mark' },
        { date: todayStr, temp: 36.8, time: '08:20', recordedBy: 'Nurse Sarah' }
      ];
      nurseVisitToday = true;
      doctorVisitToday = true;
      status = 'Discharge Review';
      doctorDecision = 'approved';
      doctorNotes = 'Patient meets 3-day fever free criteria. Vital signs stable, cleared for administrative discharge.';
    }
    // Scenario C: 3 deferred cases
    else if (i >= 12 && i < 15) {
      tempHistory = [
        { date: getDateStr(-3), temp: 36.5, time: '08:10', recordedBy: 'Nurse Clara' },
        { date: getDateStr(-2), temp: 36.7, time: '08:30', recordedBy: 'Nurse Clara' },
        { date: getDateStr(-1), temp: 37.0, time: '09:00', recordedBy: 'Nurse Clara' },
        { date: getDateStr(0), temp: 36.8, time: '08:50', recordedBy: 'Nurse Clara' }
      ];
      nurseVisitToday = true;
      doctorVisitToday = true;
      status = 'Discharge Review';
      doctorDecision = 'deferred';
      doctorNotes = 'Persistent mild respiratory distress despite normal temperature. Retain for 24h observation.';
    }
    // Scenario D: Active patients with partial temp recorded today
    else if (i >= 15 && i < 45) {
      tempHistory = [
        { date: getDateStr(-2), temp: 38.2, time: '09:00', recordedBy: 'Nurse Mark' },
        { date: getDateStr(-1), temp: 37.8, time: '09:30', recordedBy: 'Nurse Mark' },
        { date: todayStr, temp: 37.4, time: '08:15', recordedBy: 'Nurse Mark' }
      ];
      nurseVisitToday = true;
      doctorVisitToday = i % 3 === 0;
      status = 'Active';
    }
    // Scenario E: Active patients waiting for temp check today
    else {
      tempHistory = [
        { date: getDateStr(-2), temp: 38.6, time: '09:15', recordedBy: 'Nurse Sarah' },
        { date: getDateStr(-1), temp: 38.1, time: '09:00', recordedBy: 'Nurse Sarah' }
      ];
      nurseVisitToday = false;
      doctorVisitToday = false;
      status = 'Active';
    }

    patients.push({
      id,
      name,
      age,
      gender,
      room,
      admissionDate,
      status, // Active, Discharge Review, Discharged, Deceased
      tempHistory,
      nurseVisitToday,
      doctorVisitToday,
      doctorDecision,
      doctorNotes,
      notes: `Patient admitted with symptoms. Initial temp 38.5°C.`
    });
  }

  // Pre-seed some historic outcome records for analytics calculation
  const historicOutcomes = [
    { id: 'FF-PT-089', name: 'Arthur Pendelton', age: 45, gender: 'Male', room: 'Released', admissionDate: getDateStr(-12), dischargeDate: getDateStr(-2), status: 'Discharged', tempHistory: [], notes: 'Cured' },
    { id: 'FF-PT-090', name: 'Eleanor Vance', age: 62, gender: 'Female', room: 'Released', admissionDate: getDateStr(-14), dischargeDate: getDateStr(-3), status: 'Discharged', tempHistory: [], notes: 'Cured' },
    { id: 'FF-PT-091', name: 'Marcus Brody', age: 71, gender: 'Male', room: 'Released', admissionDate: getDateStr(-10), dischargeDate: getDateStr(-1), status: 'Deceased', tempHistory: [], notes: 'Severe respiratory complications' },
    { id: 'FF-PT-092', name: 'Clara Oswald', age: 29, gender: 'Female', room: 'Released', admissionDate: getDateStr(-15), dischargeDate: getDateStr(-4), status: 'Discharged', tempHistory: [], notes: 'Cured' },
    { id: 'FF-PT-093', name: 'Henry Jones', age: 58, gender: 'Male', room: 'Released', admissionDate: getDateStr(-11), dischargeDate: getDateStr(-2), status: 'Discharged', tempHistory: [], notes: 'Cured' }
  ];

  logs.push({
    id: 'LOG-001',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    user: 'System Administrator',
    role: 'Administrator',
    action: 'Facility Initialized',
    details: 'Initial occupancy set to 74 patients. 74 beds loaded.'
  });

  return {
    patients: [...patients, ...historicOutcomes],
    logs,
    facilityConfig: {
      maxCapacity: 74,
      feverThreshold: 37.5,
      mortalityBenchmark: 15,
      survivalBenchmark: 85
    }
  };
};

export default function App() {
  // --- STATE MANAGEMENT ---
  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem('FEVERFLOW_DATA');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return GENERATE_INITIAL_DATA();
  });

  // User Session State - Default to null to force demo login screen first
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('FEVERFLOW_CURRENT_USER');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('command'); // command, patients, rounds, temp, discharge, beds, analytics, activity, settings
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showTempModal, setShowTempModal] = useState(false);
  const [tempModalPatientId, setTempModalPatientId] = useState('');
  const [showDoctorReviewModal, setShowDoctorReviewModal] = useState(false);
  const [reviewPatient, setReviewPatient] = useState(null);

  // Sync data and current user session to localStorage
  useEffect(() => {
    localStorage.setItem('FEVERFLOW_DATA', JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('FEVERFLOW_CURRENT_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('FEVERFLOW_CURRENT_USER');
    }
  }, [currentUser]);

  const currentRole = currentUser?.role || 'Guest';

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const addAuditLog = (action, details) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser ? currentUser.name : 'System',
      role: currentRole,
      action,
      details
    };
    setAppData(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs]
    }));
  };

  const handleDemoLogin = (account) => {
    setCurrentUser(account);
    addAuditLog('User Login', `Session started by ${account.name} (${account.roleTitle})`);
    showToast(`Welcome back, ${account.name}! Signed in as ${account.roleTitle}.`);
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog('User Logout', `${currentUser.name} signed out.`);
    }
    setCurrentUser(null);
  };

  // --- CORE BUSINESS LOGIC HELPER FUNCTIONS ---
  
  // Calculate consecutive fever-free days for a patient
  const calculateFeverFreeDays = (tempHistory) => {
    if (!tempHistory || tempHistory.length === 0) return 0;
    
    // Sort temperature records by date ascending
    const sorted = [...tempHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    let streak = 0;
    
    // Evaluate strictly up to today
    for (let i = sorted.length - 1; i >= 0; i--) {
      const entry = sorted[i];
      if (entry.temp <= appData.facilityConfig.feverThreshold) {
        streak++;
      } else {
        // Fever breaks streak
        break;
      }
    }
    return streak;
  };

  // Active Occupancy calculation
  const activePatients = useMemo(() => {
    return appData.patients.filter(p => p.status === 'Active' || p.status === 'Discharge Review');
  }, [appData.patients]);

  const currentOccupancy = activePatients.length;
  const availableBeds = appData.facilityConfig.maxCapacity - currentOccupancy;

  // Outcome statistics calculation (Denominator: Completed outcomes = Discharged + Deceased)
  const outcomeStats = useMemo(() => {
    const discharged = appData.patients.filter(p => p.status === 'Discharged').length;
    const deceased = appData.patients.filter(p => p.status === 'Deceased').length;
    const totalOutcomes = discharged + deceased;

    const survivalRate = totalOutcomes > 0 ? ((discharged / totalOutcomes) * 100).toFixed(1) : '0.0';
    const mortalityRate = totalOutcomes > 0 ? ((deceased / totalOutcomes) * 100).toFixed(1) : '0.0';

    return {
      discharged,
      deceased,
      totalOutcomes,
      survivalRate,
      mortalityRate
    };
  }, [appData.patients]);

  // Today's completion rates
  const todayRoundsStats = useMemo(() => {
    if (activePatients.length === 0) return { tempPct: 0, docPct: 0, tempDone: 0, docDone: 0 };
    const tempDone = activePatients.filter(p => p.nurseVisitToday).length;
    const docDone = activePatients.filter(p => p.doctorVisitToday).length;
    return {
      tempDone,
      docDone,
      tempPct: Math.round((tempDone / activePatients.length) * 100),
      docPct: Math.round((docDone / activePatients.length) * 100)
    };
  }, [activePatients]);

  // Handle auto-promotion to 'Discharge Review' status when 3 consecutive fever-free days hit
  useEffect(() => {
    let updated = false;
    const newPatients = appData.patients.map(patient => {
      if (patient.status === 'Active') {
        const streak = calculateFeverFreeDays(patient.tempHistory);
        if (streak >= 3) {
          updated = true;
          addAuditLog('Flagged for Discharge Review', `Patient ${patient.name} (${patient.id}) completed 3 consecutive fever-free days.`);
          return { ...patient, status: 'Discharge Review' };
        }
      }
      return patient;
    });

    if (updated) {
      setAppData(prev => ({ ...prev, patients: newPatients }));
    }
  }, [appData.patients]);

  // --- ACTIONS ---

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (currentOccupancy >= appData.facilityConfig.maxCapacity) {
      showToast('Facility is at maximum capacity (74/74)! Cannot admit new patient.', 'error');
      return;
    }

    const formData = new FormData(e.target);
    const newId = `FF-PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      id: newId,
      name: formData.get('name'),
      age: parseInt(formData.get('age')),
      gender: formData.get('gender'),
      room: formData.get('room'),
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      tempHistory: [],
      nurseVisitToday: false,
      doctorVisitToday: false,
      doctorDecision: null,
      doctorNotes: '',
      notes: formData.get('notes') || 'Newly admitted patient.'
    };

    setAppData(prev => ({
      ...prev,
      patients: [newPatient, ...prev.patients]
    }));

    addAuditLog('Patient Admitted', `Admitted ${newPatient.name} to ${newPatient.room}`);
    showToast(`Patient ${newPatient.name} admitted successfully to ${newPatient.room}.`);
    setShowAddPatientModal(false);
  };

  const handleRecordTemperature = (patientId, tempVal, notes) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAppData(prev => {
      const updated = prev.patients.map(patient => {
        if (patient.id === patientId) {
          // Check if entry already exists for today
          const existingTodayIdx = patient.tempHistory.findIndex(h => h.date === todayStr);
          let newHistory = [...patient.tempHistory];

          if (existingTodayIdx >= 0) {
            // Authorized edit/correction
            newHistory[existingTodayIdx] = {
              date: todayStr,
              temp: parseFloat(tempVal),
              time: timeStr,
              recordedBy: `${currentRole} User (Updated)`,
              notes
            };
          } else {
            newHistory.push({
              date: todayStr,
              temp: parseFloat(tempVal),
              time: timeStr,
              recordedBy: `${currentRole} User`,
              notes
            });
          }

          return {
            ...patient,
            tempHistory: newHistory,
            nurseVisitToday: true
          };
        }
        return patient;
      });
      return { ...prev, patients: updated };
    });

    addAuditLog('Temperature Recorded', `Recorded ${tempVal}°C for patient ID ${patientId}`);
    showToast(`Recorded ${tempVal}°C for patient ${patientId}`);
    setShowTempModal(false);
  };

  const handleToggleDoctorVisit = (patientId) => {
    setAppData(prev => ({
      ...prev,
      patients: prev.patients.map(p => {
        if (p.id === patientId) {
          const nextState = !p.doctorVisitToday;
          addAuditLog('Doctor Round Updated', `Patient ${p.name} doctor visit set to ${nextState ? 'Completed' : 'Pending'}`);
          return { ...p, doctorVisitToday: nextState };
        }
        return p;
      })
    }));
  };

  const handleDoctorDecision = (patientId, decision, notes) => {
    setAppData(prev => ({
      ...prev,
      patients: prev.patients.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            doctorDecision: decision,
            doctorNotes: notes
          };
        }
        return p;
      })
    }));

    addAuditLog(`Discharge Review: ${decision.toUpperCase()}`, `Doctor decision for ${patientId}: ${decision}. Notes: ${notes}`);
    showToast(`Discharge review saved as ${decision.toUpperCase()}.`);
    setShowDoctorReviewModal(false);
  };

  const handleAdminFinalDischarge = (patientId, isDeceased = false) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setAppData(prev => ({
      ...prev,
      patients: prev.patients.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            status: isDeceased ? 'Deceased' : 'Discharged',
            dischargeDate: todayStr,
            room: 'Released'
          };
        }
        return p;
      })
    }));

    const actionText = isDeceased ? 'Marked Deceased & Released Bed' : 'Completed Discharge & Released Bed';
    addAuditLog(actionText, `Patient ID ${patientId} processed by Administrator.`);
    showToast(isDeceased ? `Patient record closed (Deceased). Bed released.` : `Patient successfully discharged! Bed is now available.`);
  };

  const handleResetData = () => {
    const initial = GENERATE_INITIAL_DATA();
    setAppData(initial);
    localStorage.setItem('FEVERFLOW_DATA', JSON.stringify(initial));
    showToast('System data reset to initial 74-patient demo state.');
  };

  // Selected patient details helper
  const selectedPatient = useMemo(() => {
    return appData.patients.find(p => p.id === selectedPatientId) || null;
  }, [appData.patients, selectedPatientId]);

  // Filtered patients for tables
  const filteredPatients = useMemo(() => {
    return appData.patients.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.room.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [appData.patients, searchQuery]);

  // Occupied rooms set
  const occupiedRooms = useMemo(() => {
    const set = new Set();
    activePatients.forEach(p => set.add(p.room));
    return set;
  }, [activePatients]);

  // ==================== SCREEN 1: LOGIN / DEMO ROLE SELECTION ====================
  if (!currentUser) {
    const demoAccounts = [
      {
        id: 'acc-admin',
        name: 'Priya Nair',
        role: 'Administrator',
        roleTitle: 'Administrator',
        assignedScope: 'Full Facility (Rooms 101–174)',
        description: 'Full facility management, admissions, bed allocation & admin discharges.'
      },
      {
        id: 'acc-nurse',
        name: 'Anil Das',
        role: 'Nurse',
        roleTitle: 'Nurse (rooms 1–37)',
        assignedScope: 'Rooms 101–137',
        description: 'Triage, daily temperature logging & nurse rounds.'
      },
      {
        id: 'acc-doctor',
        name: 'Dr. Meera Rao',
        role: 'Doctor',
        roleTitle: 'Doctor (rooms 1–37)',
        assignedScope: 'Rooms 101–137',
        description: 'Physician daily visits, recovery evaluations & discharge clearance.'
      }
    ];

    return (
      <div className="min-h-screen w-full bg-[#F7FAFC] flex flex-col items-center justify-center p-4 antialiased">
        
        {/* BRAND LOGO HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#247BA0] to-[#2A9D8F] flex items-center justify-center text-white shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-[#247BA0] leading-none">FEVERFLOW</h1>
            <p className="text-xs font-semibold text-[#718096] uppercase tracking-wider mt-1">Smart Quarantine & Treatment Management</p>
          </div>
        </div>

        {/* DEMO ACCOUNT SELECTION CARD MATCHING SCREENSHOT DESIGN EXACTLY */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E3EAF0] p-8 shadow-sm space-y-6">
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#718096]">
              Every reading matters. Every patient moves forward.
            </p>
            <h2 className="text-xl font-bold text-[#203247]">
              Choose a demo account
            </h2>
          </div>

          <div className="space-y-3">
            {demoAccounts.map(account => (
              <button
                key={account.id}
                onClick={() => handleDemoLogin(account)}
                className="w-full text-left p-4 rounded-xl border border-[#E3EAF0] hover:border-[#247BA0] hover:bg-[#EAF4FA]/40 transition duration-150 group flex flex-col"
              >
                <span className="font-bold text-base text-[#203247] group-hover:text-[#247BA0] transition">
                  {account.name}
                </span>
                <span className="text-sm font-medium text-[#718096] mt-0.5">
                  {account.roleTitle}
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs text-[#718096] leading-relaxed pt-2">
            Demo sign-in only, not real authentication and not for production. All patients are fictional DEMO DATA.
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F7FAFC] text-[#203247] font-sans antialiased overflow-hidden">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 ${toastMessage.type === 'error' ? 'bg-[#D85C5C]' : 'bg-[#26966F]'}`}>
          {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* --- LEFT SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-white border-r border-[#E3EAF0] flex flex-col justify-between shrink-0 shadow-sm z-20">
        <div>
          {/* Brand Logo & Name */}
          <div className="p-5 border-b border-[#E3EAF0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#247BA0] to-[#2A9D8F] flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight tracking-tight text-[#247BA0]">FEVERFLOW</h1>
              <p className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">Smart Quarantine</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'command', label: 'Command Center', icon: Activity, badge: activePatients.filter(p => p.status === 'Discharge Review').length },
              { id: 'patients', label: 'Patient Registry', icon: Users },
              { id: 'rounds', label: 'Daily Rounds', icon: Clock, badge: activePatients.length - todayRoundsStats.tempDone },
              { id: 'temp', label: 'Temperature Logs', icon: Thermometer },
              { id: 'discharge', label: 'Recovery & Discharge', icon: Award, badge: appData.patients.filter(p => p.status === 'Discharge Review' && !p.doctorDecision).length },
              { id: 'beds', label: 'Bed Management', icon: Building2, badge: availableBeds > 0 ? `${availableBeds} free` : 'FULL' },
              { id: 'analytics', label: 'Quality & Outcomes', icon: TrendingUp },
              { id: 'activity', label: 'Activity Log', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-[#EAF4FA] text-[#247BA0] font-semibold shadow-sm' 
                      : 'text-[#718096] hover:bg-gray-50 hover:text-[#203247]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#247BA0]' : 'text-[#718096]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.id === 'beds' && availableBeds === 0 ? 'bg-amber-100 text-amber-700' :
                      item.id === 'discharge' ? 'bg-[#EAF4FA] text-[#247BA0]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Facility & Reset Info */}
        <div className="p-4 border-t border-[#E3EAF0] bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718096]">Facility Capacity</span>
            <span className="text-xs font-bold text-[#203247]">{currentOccupancy}/74</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
            <div 
              className={`h-full transition-all ${currentOccupancy >= 74 ? 'bg-[#D85C5C]' : 'bg-[#247BA0]'}`} 
              style={{ width: `${(currentOccupancy / 74) * 100}%` }}
            />
          </div>
          <button 
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-white hover:border-gray-400 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-[#E3EAF0] px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" />
              <input 
                type="text" 
                placeholder="Search patient name, ID, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl border border-[#E3EAF0] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#247BA0]/20 focus:border-[#247BA0] transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Today's Simulated Date */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#718096] bg-gray-50 px-3 py-1.5 rounded-lg border border-[#E3EAF0]">
              <Calendar className="w-3.5 h-3.5 text-[#247BA0]" />
              <span>Today: <strong>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
            </div>

            {/* Quick Action Button - Restricted to Administrator */}
            {currentRole === 'Administrator' ? (
              <button 
                onClick={() => setShowAddPatientModal(true)}
                className="flex items-center gap-1.5 bg-[#247BA0] text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-[#1d6483] transition shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Admit Patient</span>
              </button>
            ) : (
              <span className="hidden sm:inline-block text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                Scope: {currentUser.assignedScope}
              </span>
            )}

            {/* USER PROFILE & LOGOUT */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#203247]">{currentUser.name}</div>
                <div className="text-[11px] font-semibold text-[#247BA0]">{currentUser.roleTitle}</div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out of demo session"
                className="p-2 rounded-xl border border-[#E3EAF0] text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* SCREEN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F7FAFC]">
          
          {/* ==================== SCREEN 1: COMMAND CENTER ==================== */}
          {activeTab === 'command' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#203247]">Quarantine Command Center</h2>
                  <p className="text-sm text-[#718096]">Active Session: <strong>{currentUser.name}</strong> ({currentUser.roleTitle})</p>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#26966F] border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-[#26966F] animate-pulse"></span>
                    Facility Status: Operational
                  </span>
                </div>
              </div>

              {/* KPI STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Capacity & Occupancy */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3EAF0] shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Occupied Beds</p>
                    <h3 className="text-3xl font-extrabold text-[#203247] mt-1">{currentOccupancy} <span className="text-sm font-normal text-gray-500">/ 74</span></h3>
                    <p className="text-xs text-[#247BA0] font-medium mt-1">{availableBeds} beds available</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#EAF4FA] flex items-center justify-center text-[#247BA0]">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Today's Temp Completion */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3EAF0] shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Temp Checks Today</p>
                    <h3 className="text-3xl font-extrabold text-[#203247] mt-1">{todayRoundsStats.tempPct}%</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">{todayRoundsStats.tempDone} of {activePatients.length} recorded</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#2A9D8F]">
                    <Thermometer className="w-6 h-6" />
                  </div>
                </div>

                {/* Today's Doctor Visits */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3EAF0] shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Doctor Visits</p>
                    <h3 className="text-3xl font-extrabold text-[#203247] mt-1">{todayRoundsStats.docPct}%</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">{todayRoundsStats.docDone} of {activePatients.length} completed</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                {/* Discharge Review Queue */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3EAF0] shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Eligible for Discharge</p>
                    <h3 className="text-3xl font-extrabold text-[#247BA0] mt-1">
                      {activePatients.filter(p => p.status === 'Discharge Review').length}
                    </h3>
                    <p className="text-xs text-[#26966F] font-medium mt-1">3-day fever-free met</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* ACTIONABLE ALERTS BANNER */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Priority Queue (Left 2 Columns) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl border border-[#E3EAF0] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-[#203247]">Discharge Review Queue (3-Day Fever-Free)</h3>
                        <p className="text-xs text-[#718096]">Patients meeting administrative criteria requiring Doctor review or Admin release.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('discharge')}
                        className="text-xs font-bold text-[#247BA0] hover:underline flex items-center gap-1"
                      >
                        View Full Pipeline <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activePatients.filter(p => p.status === 'Discharge Review').length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">No patients currently awaiting discharge review.</div>
                      ) : (
                        activePatients
                          .filter(p => p.status === 'Discharge Review')
                          .slice(0, 4)
                          .map(p => {
                            const streak = calculateFeverFreeDays(p.tempHistory);
                            return (
                              <div key={p.id} className="p-3.5 rounded-xl border border-[#E3EAF0] bg-[#EAF4FA]/50 flex items-center justify-between hover:bg-[#EAF4FA] transition">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-[#247BA0] text-white flex items-center justify-center font-bold text-sm">
                                    {p.room.split(' ')[1]}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-sm text-[#203247]">{p.name}</h4>
                                      <span className="text-xs text-gray-500">({p.id})</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-0.5">
                                      <span className="text-[#26966F] font-semibold">✓ {streak} Days Fever-Free</span>
                                      <span>•</span>
                                      <span>Last Temp: <strong>{p.tempHistory[p.tempHistory.length - 1]?.temp}°C</strong></span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {p.doctorDecision === 'approved' ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      Doctor Approved
                                    </span>
                                  ) : p.doctorDecision === 'deferred' ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                      Doctor Deferred
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                      Awaiting Doctor Review
                                    </span>
                                  )}

                                  <button
                                    onClick={() => {
                                      setSelectedPatientId(p.id);
                                      setActiveTab('discharge');
                                    }}
                                    className="p-1.5 rounded-lg border border-[#E3EAF0] bg-white text-[#247BA0] hover:bg-gray-50"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>

                  {/* Immediate Operational Priority Cards */}
                  <div className="bg-white rounded-2xl border border-[#E3EAF0] p-5 shadow-sm">
                    <h3 className="font-bold text-lg text-[#203247] mb-3">Operational Alerts & Immediate Action</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-amber-900">Missing Temperatures Today</h4>
                          <p className="text-xs text-amber-700 mt-1">{activePatients.length - todayRoundsStats.tempDone} active patients still require nurse readings today.</p>
                          <button 
                            onClick={() => setActiveTab('rounds')}
                            className="mt-2 text-xs font-bold text-amber-800 hover:underline"
                          >
                            Open Nurse Rounds →
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-start gap-3">
                        <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-indigo-900">Pending Doctor Consultations</h4>
                          <p className="text-xs text-indigo-700 mt-1">{activePatients.length - todayRoundsStats.docDone} patients require daily physician visits.</p>
                          <button 
                            onClick={() => setActiveTab('rounds')}
                            className="mt-2 text-xs font-bold text-indigo-800 hover:underline"
                          >
                            Open Doctor Board →
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Right Column: Outcomes Quick Summary */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-[#E3EAF0] p-5 shadow-sm">
                    <h3 className="font-bold text-lg text-[#203247] mb-4">Quality & Outcomes Summary</h3>
                    
                    {/* Survival Benchmark Widget */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#718096]">Survival Rate (Target: 85%)</span>
                          <span className={parseFloat(outcomeStats.survivalRate) >= 85 ? 'text-[#26966F]' : 'text-[#D85C5C]'}>
                            {outcomeStats.survivalRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${parseFloat(outcomeStats.survivalRate) >= 85 ? 'bg-[#26966F]' : 'bg-[#D85C5C]'}`}
                            style={{ width: `${Math.min(100, parseFloat(outcomeStats.survivalRate))}%` }}
                          />
                        </div>
                      </div>

                      {/* Mortality Benchmark Widget */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#718096]">Mortality Rate (Limit: 15%)</span>
                          <span className={parseFloat(outcomeStats.mortalityRate) <= 15 ? 'text-[#26966F]' : 'text-[#D85C5C]'}>
                            {outcomeStats.mortalityRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${parseFloat(outcomeStats.mortalityRate) <= 15 ? 'bg-[#2A9D8F]' : 'bg-[#D85C5C]'}`}
                            style={{ width: `${Math.min(100, parseFloat(outcomeStats.mortalityRate))}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl border border-[#E3EAF0] text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Total Completed Outcomes:</span>
                          <strong className="text-[#203247]">{outcomeStats.totalOutcomes}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Successfully Discharged:</span>
                          <strong className="text-[#26966F]">{outcomeStats.discharged}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Deceased Cases:</span>
                          <strong className="text-[#D85C5C]">{outcomeStats.deceased}</strong>
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveTab('analytics')}
                        className="w-full py-2 bg-[#EAF4FA] text-[#247BA0] font-bold text-xs rounded-xl hover:bg-[#d8ebd9] transition text-center block"
                      >
                        View Quality Analytics Dashboard
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== SCREEN 2: PATIENT REGISTRY ==================== */}
          {activeTab === 'patients' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#203247]">Patient Registry</h2>
                  <p className="text-sm text-[#718096]">Complete directory of active and historic quarantine patients.</p>
                </div>
                {currentRole === 'Administrator' ? (
                  <button 
                    onClick={() => setShowAddPatientModal(true)}
                    className="flex items-center justify-center gap-2 bg-[#247BA0] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#1d6483] transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    Admit New Patient
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-2 rounded-xl">
                    Read-Only Access for {currentRole}
                  </span>
                )}
              </div>

              {/* TABLE CARD */}
              <div className="bg-white rounded-2xl border border-[#E3EAF0] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E3EAF0] bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Showing {filteredPatients.length} Patients
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#EAF4FA]/60 text-[#203247] text-xs uppercase tracking-wider font-bold border-b border-[#E3EAF0]">
                      <tr>
                        <th className="py-3.5 px-4">Patient ID & Name</th>
                        <th className="py-3.5 px-4">Demographics</th>
                        <th className="py-3.5 px-4">Room Allocation</th>
                        <th className="py-3.5 px-4">Admission Date</th>
                        <th className="py-3.5 px-4">Current Status</th>
                        <th className="py-3.5 px-4">Fever-Free Days</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3EAF0]">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-gray-500">
                            No patients found matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map(p => {
                          const streak = calculateFeverFreeDays(p.tempHistory);
                          return (
                            <tr key={p.id} className="hover:bg-gray-50/80 transition">
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#203247]">{p.name}</div>
                                <div className="text-xs text-gray-400">{p.id}</div>
                              </td>
                              <td className="py-3.5 px-4 text-xs text-gray-600">
                                {p.age} yrs • {p.gender}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                                  p.room === 'Released' ? 'bg-gray-100 text-gray-500' : 'bg-[#EAF4FA] text-[#247BA0]'
                                }`}>
                                  {p.room}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-xs text-gray-600">{p.admissionDate}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                                  p.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                  p.status === 'Discharge Review' ? 'bg-amber-100 text-amber-800' :
                                  p.status === 'Discharged' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    streak >= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {streak} / 3 Days
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedPatientId(p.id);
                                    setActiveTab('profile');
                                  }}
                                  className="px-3 py-1.5 text-xs font-bold bg-[#EAF4FA] text-[#247BA0] rounded-xl hover:bg-[#d7e9f7] transition"
                                >
                                  View Profile
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SCREEN 3: PATIENT PROFILE VIEW & RECOVERY TIMELINE ==================== */}
          {(activeTab === 'profile' || selectedPatientId) && activeTab === 'profile' && selectedPatient && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <button 
                onClick={() => setActiveTab('patients')}
                className="text-xs font-bold text-[#718096] hover:text-[#203247] flex items-center gap-1"
              >
                ← Back to Patient Registry
              </button>

              {/* DEMOGRAPHICS HEADER CARD */}
              <div className="bg-white rounded-2xl border border-[#E3EAF0] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#247BA0] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-[#203247]">{selectedPatient.name}</h2>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF4FA] text-[#247BA0]">
                        {selectedPatient.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selectedPatient.age} years old • {selectedPatient.gender} • Assigned Room: <strong>{selectedPatient.room}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {currentRole === 'Nurse' && (
                    <button
                      onClick={() => {
                        setTempModalPatientId(selectedPatient.id);
                        setShowTempModal(true);
                      }}
                      className="flex items-center gap-2 bg-[#2A9D8F] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#238377] transition shadow-sm"
                    >
                      <Thermometer className="w-4 h-4" />
                      Record Temp
                    </button>
                  )}

                  {currentRole === 'Doctor' && selectedPatient.status === 'Discharge Review' && (
                    <button
                      onClick={() => {
                        setReviewPatient(selectedPatient);
                        setShowDoctorReviewModal(true);
                      }}
                      className="flex items-center gap-2 bg-[#247BA0] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#1d6483] transition shadow-sm"
                    >
                      <Award className="w-4 h-4" />
                      Doctor Discharge Review
                    </button>
                  )}
                </div>
              </div>

              {/* FEATURE 3: CHRONOLOGICAL RECOVERY TIMELINE */}
              <div className="bg-white rounded-2xl border border-[#E3EAF0] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#203247] mb-1">Clinical Recovery Timeline</h3>
                <p className="text-xs text-[#718096] mb-6">Tracking admission to 3-day consecutive fever-free status and doctor discharge clearance.</p>

                {/* VISUAL TIMELINE STEPPER */}
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-2 md:border-l-0 md:border-t-2 border-[#E3EAF0] pt-0 md:pt-6 pl-4 md:pl-0">
                  
                  {/* Step 1: Admission */}
                  <div className="relative flex flex-col gap-1">
                    <div className="w-6 h-6 rounded-full bg-[#247BA0] text-white flex items-center justify-center text-xs font-bold -mt-3 md:-mt-9">1</div>
                    <span className="text-xs font-bold text-[#203247] mt-1">Admission</span>
                    <span className="text-[11px] text-gray-500">{selectedPatient.admissionDate}</span>
                  </div>

                  {/* Step 2: Day 1 Fever Free */}
                  {(() => {
                    const streak = calculateFeverFreeDays(selectedPatient.tempHistory);
                    return (
                      <>
                        <div className="relative flex flex-col gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -mt-3 md:-mt-9 ${
                            streak >= 1 ? 'bg-[#26966F] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {streak >= 1 ? '✓' : '2'}
                          </div>
                          <span className="text-xs font-bold text-[#203247] mt-1">Fever-Free Day 1</span>
                          <span className="text-[11px] text-gray-500">{streak >= 1 ? 'Passed' : 'Pending'}</span>
                        </div>

                        {/* Step 3: Day 2 Fever Free */}
                        <div className="relative flex flex-col gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -mt-3 md:-mt-9 ${
                            streak >= 2 ? 'bg-[#26966F] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {streak >= 2 ? '✓' : '3'}
                          </div>
                          <span className="text-xs font-bold text-[#203247] mt-1">Fever-Free Day 2</span>
                          <span className="text-[11px] text-gray-500">{streak >= 2 ? 'Passed' : 'Pending'}</span>
                        </div>

                        {/* Step 4: Day 3 Fever Free */}
                        <div className="relative flex flex-col gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -mt-3 md:-mt-9 ${
                            streak >= 3 ? 'bg-[#26966F] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {streak >= 3 ? '✓' : '4'}
                          </div>
                          <span className="text-xs font-bold text-[#203247] mt-1">Fever-Free Day 3</span>
                          <span className="text-[11px] text-gray-500">{streak >= 3 ? 'Target Met!' : 'Pending'}</span>
                        </div>

                        {/* Step 5: Doctor Review */}
                        <div className="relative flex flex-col gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -mt-3 md:-mt-9 ${
                            selectedPatient.doctorDecision === 'approved' ? 'bg-[#26966F] text-white' :
                            selectedPatient.doctorDecision === 'deferred' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            5
                          </div>
                          <span className="text-xs font-bold text-[#203247] mt-1">Doctor Clearance</span>
                          <span className="text-[11px] text-gray-500">
                            {selectedPatient.doctorDecision ? selectedPatient.doctorDecision.toUpperCase() : 'Awaiting Review'}
                          </span>
                        </div>

                        {/* Step 6: Final Discharge */}
                        <div className="relative flex flex-col gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -mt-3 md:-mt-9 ${
                            selectedPatient.status === 'Discharged' ? 'bg-[#26966F] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            6
                          </div>
                          <span className="text-xs font-bold text-[#203247] mt-1">Admin Discharge</span>
                          <span className="text-[11px] text-gray-500">
                            {selectedPatient.status === 'Discharged' ? 'Bed Released' : 'Pending'}
                          </span>
                        </div>
                      </>
                    );
                  })()}

                </div>
              </div>

              {/* TEMPERATURE READINGS HISTORY TABLE */}
              <div className="bg-white rounded-2xl border border-[#E3EAF0] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#203247] mb-4">Complete Temperature Audit History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold border-b border-[#E3EAF0]">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Temperature (°C)</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Recorded By</th>
                        <th className="py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3EAF0]">
                      {selectedPatient.tempHistory.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-6 text-center text-gray-500 text-sm">No temperature logs recorded yet.</td>
                        </tr>
                      ) : (
                        [...selectedPatient.tempHistory].reverse().map((h, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold text-[#203247]">{h.date}</td>
                            <td className="py-3 px-4 text-xs text-gray-500">{h.time}</td>
                            <td className="py-3 px-4 font-bold text-base">
                              <span className={h.temp > 37.5 ? 'text-[#D85C5C]' : 'text-[#26966F]'}>
                                {h.temp}°C
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {h.temp > 37.5 ? (
                                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-800">FEVER</span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">NORMAL</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-600">{h.recordedBy}</td>
                            <td className="py-3 px-4 text-xs text-gray-500">{h.notes || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================== SCREEN 4: DAILY ROUNDS BOARD ==================== */}
          {activeTab === 'rounds' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#203247]">Smart Daily Rounds Board</h2>
                  <p className="text-sm text-[#718096]">Independent tracking for Nurse Temperature checks and Doctor Consultations.</p>
                </div>
                <div className="flex gap-4 text-xs font-semibold">
                  <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-[#2A9D8F] border border-teal-200">
                    Nurse Progress: {todayRoundsStats.tempDone}/{activePatients.length} ({todayRoundsStats.tempPct}%)
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Doctor Progress: {todayRoundsStats.docDone}/{activePatients.length} ({todayRoundsStats.docPct}%)
                  </span>
                </div>
              </div>

              {/* THREE COLUMN COORDINATION BOARD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* COLUMN 1: Temperature Pending */}
                <div className="bg-white p-4 rounded-2xl border border-[#E3EAF0] shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3EAF0]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <h3 className="font-bold text-sm text-[#203247]">Nurse Check Pending</h3>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      {activePatients.filter(p => !p.nurseVisitToday).length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {activePatients.filter(p => !p.nurseVisitToday).map(p => (
                      <div key={p.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-[#2A9D8F] transition space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-extrabold text-[#247BA0] px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                              {p.room}
                            </span>
                            <h4 className="font-bold text-sm text-[#203247] mt-1">{p.name}</h4>
                          </div>
                          {currentRole === 'Nurse' ? (
                            <button
                              onClick={() => {
                                setTempModalPatientId(p.id);
                                setShowTempModal(true);
                              }}
                              className="px-2.5 py-1 text-xs font-bold bg-[#2A9D8F] text-white rounded-lg hover:bg-[#207a6f]"
                            >
                              + Record
                            </button>
                          ) : (
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold">
                              Nurse Only
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Last Temp: {p.tempHistory.slice(-1)[0]?.temp || 'None'}°C</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: Doctor Visit Pending */}
                <div className="bg-white p-4 rounded-2xl border border-[#E3EAF0] shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3EAF0]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <h3 className="font-bold text-sm text-[#203247]">Doctor Consult Pending</h3>
                    </div>
                    <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                      {activePatients.filter(p => !p.doctorVisitToday).length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {activePatients.filter(p => !p.doctorVisitToday).map(p => (
                      <div key={p.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-indigo-400 transition space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-extrabold text-[#247BA0] px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                              {p.room}
                            </span>
                            <h4 className="font-bold text-sm text-[#203247] mt-1">{p.name}</h4>
                          </div>
                          {currentRole === 'Doctor' ? (
                            <button
                              onClick={() => handleToggleDoctorVisit(p.id)}
                              className="px-2.5 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                              Mark Visited
                            </button>
                          ) : (
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold">
                              Doctor Only
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Nurse Check Today: {p.nurseVisitToday ? '✓ Done' : '⚠️ Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: Fully Completed Today */}
                <div className="bg-white p-4 rounded-2xl border border-[#E3EAF0] shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3EAF0]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#26966F]" />
                      <h3 className="font-bold text-sm text-[#203247]">Both Rounds Completed</h3>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {activePatients.filter(p => p.nurseVisitToday && p.doctorVisitToday).length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {activePatients.filter(p => p.nurseVisitToday && p.doctorVisitToday).map(p => (
                      <div key={p.id} className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#247BA0]">{p.room}</span>
                          <span className="text-xs text-[#26966F] font-bold">✓ Ready</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#203247]">{p.name}</h4>
                        <p className="text-xs text-gray-500">Today's Reading: {p.tempHistory.slice(-1)[0]?.temp}°C</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== SCREEN 5: TEMPERATURE RECORDS & RECORDING ==================== */}
          {activeTab === 'temp' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#203247]">Temperature Records & Logs</h2>
                  <p className="text-sm text-[#718096]">Log new readings and review complete temperature histories.</p>
                </div>
                {currentRole === 'Nurse' ? (
                  <button
                    onClick={() => {
                      setTempModalPatientId(activePatients[0]?.id || '');
                      setShowTempModal(true);
                    }}
                    className="flex items-center gap-2 bg-[#2A9D8F] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#238377] transition"
                  >
                    <Thermometer className="w-4 h-4" />
                    + Record Temperature
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-2 rounded-xl">
                    Nurse Role Required to Input Readings
                  </span>
                )}
              </div>

              {/* LOGS TABLE */}
              <div className="bg-white rounded-2xl border border-[#E3EAF0] shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50/50 border-b border-[#E3EAF0] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#203247]">Recent Daily Temperature Entries</h3>
                  <span className="text-xs text-[#718096]">Threshold: &gt; 37.5°C = Fever</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#EAF4FA]/60 text-[#203247] text-xs uppercase font-bold border-b border-[#E3EAF0]">
                      <tr>
                        <th className="py-3 px-4">Patient</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Latest Temp</th>
                        <th className="py-3 px-4">Status Today</th>
                        <th className="py-3 px-4">Fever-Free Streak</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3EAF0]">
                      {activePatients.map(p => {
                        const lastRead = p.tempHistory.slice(-1)[0];
                        const streak = calculateFeverFreeDays(p.tempHistory);
                        return (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-bold text-[#203247]">{p.name} <span className="text-xs text-gray-400 font-normal">({p.id})</span></td>
                            <td className="py-3 px-4 font-semibold text-xs text-[#247BA0]">{p.room}</td>
                            <td className="py-3 px-4 font-bold">
                              {lastRead ? (
                                <span className={lastRead.temp > 37.5 ? 'text-[#D85C5C]' : 'text-[#26966F]'}>
                                  {lastRead.temp}°C
                                </span>
                              ) : '-'}
                            </td>
                            <td className="py-3 px-4">
                              {p.nurseVisitToday ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Recorded Today</span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-xs">{streak} Consecutive Days</td>
                            <td className="py-3 px-4 text-right">
                              {currentRole === 'Nurse' ? (
                                <button
                                  onClick={() => {
                                    setTempModalPatientId(p.id);
                                    setShowTempModal(true);
                                  }}
                                  className="px-3 py-1 text-xs font-bold bg-gray-100 text-[#203247] rounded-lg hover:bg-gray-200"
                                >
                                  {p.nurseVisitToday ? 'Edit Entry' : 'Add Entry'}
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400 italic">View Only</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SCREEN 6: RECOVERY & DISCHARGE PIPELINE ==================== */}
          {activeTab === 'discharge' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-[#203247]">Recovery & Discharge Pipeline</h2>
                <p className="text-sm text-[#718096]">3-day fever-free review workflow. Requires Doctor clinical clearance and Admin release.</p>
              </div>

              {/* PIPELINE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* SECTION 1: Eligible for Doctor Review (3-day fever free met) */}
                <div className="bg-white rounded-2xl border border-[#E3EAF0] p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E3EAF0]">
                    <h3 className="font-bold text-sm text-[#203247]">1. Awaiting Doctor Review</h3>
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {activePatients.filter(p => p.status === 'Discharge Review' && !p.doctorDecision).length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activePatients.filter(p => p.status === 'Discharge Review' && !p.doctorDecision).map(p => (
                      <div key={p.id} className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-extrabold text-[#247BA0]">{p.room}</span>
                            <span className="text-xs font-bold text-[#26966F]">✓ 3 Days Fever-Free</span>
                          </div>
                          <h4 className="font-bold text-base text-[#203247] mt-1">{p.name}</h4>
                          <p className="text-xs text-gray-500">Admitted: {p.admissionDate}</p>
                        </div>

                        {currentRole === 'Doctor' ? (
                          <button
                            onClick={() => {
                              setReviewPatient(p);
                              setShowDoctorReviewModal(true);
                            }}
                            className="w-full py-2 bg-[#247BA0] text-white text-xs font-bold rounded-xl hover:bg-[#1d6483] transition"
                          >
                            Perform Clinical Review
                          </button>
                        ) : (
                          <div className="p-2 bg-gray-100 text-center text-xs text-gray-500 rounded-lg font-medium">
                            Requires Doctor Profile to Perform Review
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 2: Doctor Approved (Awaiting Admin Discharge) */}
                <div className="bg-white rounded-2xl border border-[#E3EAF0] p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E3EAF0]">
                    <h3 className="font-bold text-sm text-[#203247]">2. Doctor Approved (Awaiting Admin)</h3>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {activePatients.filter(p => p.status === 'Discharge Review' && p.doctorDecision === 'approved').length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activePatients.filter(p => p.status === 'Discharge Review' && p.doctorDecision === 'approved').map(p => (
                      <div key={p.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-extrabold text-[#247BA0]">{p.room}</span>
                            <span className="text-xs font-bold text-emerald-700">Cleared for Discharge</span>
                          </div>
                          <h4 className="font-bold text-base text-[#203247] mt-1">{p.name}</h4>
                          <p className="text-xs text-gray-600 italic mt-1">"{p.doctorNotes}"</p>
                        </div>

                        {currentRole === 'Administrator' ? (
                          <button
                            onClick={() => handleAdminFinalDischarge(p.id)}
                            className="w-full py-2 bg-[#26966F] text-white text-xs font-bold rounded-xl hover:bg-[#1e7858] transition shadow-sm"
                          >
                            Complete Discharge & Release Bed
                          </button>
                        ) : (
                          <div className="p-2 bg-gray-100 text-center text-xs text-gray-500 rounded-lg font-medium">
                            Admin Role Required to Release Bed
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 3: Deferred Cases & Completed Discharges */}
                <div className="bg-white rounded-2xl border border-[#E3EAF0] p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E3EAF0]">
                    <h3 className="font-bold text-sm text-[#203247]">3. Deferred & Historical</h3>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-gray-400">Deferred Cases</h4>
                    {activePatients.filter(p => p.status === 'Discharge Review' && p.doctorDecision === 'deferred').map(p => (
                      <div key={p.id} className="p-3 rounded-xl border border-amber-200 bg-amber-50/40">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-amber-900">{p.name}</span>
                          <span className="text-amber-700">{p.room}</span>
                        </div>
                        <p className="text-xs text-amber-800 mt-1">Reason: {p.doctorNotes}</p>
                      </div>
                    ))}

                    <h4 className="text-xs font-bold uppercase text-gray-400 pt-3">Recent Discharges</h4>
                    {appData.patients.filter(p => p.status === 'Discharged').slice(0, 3).map(p => (
                      <div key={p.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-[#203247]">{p.name}</div>
                          <div className="text-gray-400">Discharged: {p.dischargeDate || 'Recent'}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">CURED</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== SCREEN 7: BED MANAGEMENT (74 BEDS GRID) ==================== */}
          {activeTab === 'beds' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#203247]">Visual Bed Management Grid (74 Beds)</h2>
                  <p className="text-sm text-[#718096]">Interactive bed layout. Strict capacity enforcement: Occupied ({currentOccupancy}) + Available ({availableBeds}) = 74.</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#247BA0]" /> Occupied</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> Review Queue</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Free</div>
                </div>
              </div>

              {/* 74 ROOM TILES GRID */}
              <div className="bg-white p-6 rounded-2xl border border-[#E3EAF0] shadow-sm">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {Array.from({ length: 74 }, (_, i) => {
                    const roomName = `Room ${101 + i}`;
                    const occupant = activePatients.find(p => p.room === roomName);
                    
                    let bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100';
                    let statusLabel = 'AVAILABLE';

                    if (occupant) {
                      if (occupant.status === 'Discharge Review') {
                        bgClass = 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200';
                        statusLabel = 'REVIEW';
                      } else {
                        bgClass = 'bg-[#EAF4FA] border-[#247BA0]/40 text-[#247BA0] hover:bg-[#d4e6f4]';
                        statusLabel = 'OCCUPIED';
                      }
                    }

                    return (
                      <div
                        key={roomName}
                        onClick={() => {
                          if (occupant) {
                            setSelectedPatientId(occupant.id);
                            setActiveTab('profile');
                          } else {
                            showToast(`${roomName} is available for immediate patient admission.`);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between h-20 ${bgClass}`}
                      >
                        <span className="font-extrabold text-xs">{101 + i}</span>
                        <span className="text-[10px] font-bold truncate">
                          {occupant ? occupant.name.split(' ')[0] : 'EMPTY'}
                        </span>
                        <span className="text-[9px] font-bold opacity-75">{statusLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================== SCREEN 8: QUALITY & OUTCOMES DASHBOARD ==================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-[#203247]">Quality & Outcome Performance Analytics</h2>
                <p className="text-sm text-[#718096]">Evaluation of treatment efficacy against strict hospital benchmarks (85% Survival / 15% Mortality).</p>
              </div>

              {/* BENCHMARK COMPARISON WIDGETS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Survival Benchmark Card */}
                <div className="bg-white p-6 rounded-2xl border border-[#E3EAF0] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#203247] text-lg">Survival Performance Rate</h3>
                      <p className="text-xs text-[#718096]">Target Benchmark: 85% Minimum Success</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      parseFloat(outcomeStats.survivalRate) >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {parseFloat(outcomeStats.survivalRate) >= 85 ? 'Target Met' : 'Below Target'}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-[#203247]">{outcomeStats.survivalRate}%</span>
                    <span className="text-xs text-gray-500 font-medium">Denominator: {outcomeStats.totalOutcomes} completed outcomes</span>
                  </div>

                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${parseFloat(outcomeStats.survivalRate) >= 85 ? 'bg-[#26966F]' : 'bg-[#D85C5C]'}`}
                      style={{ width: `${Math.min(100, parseFloat(outcomeStats.survivalRate))}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Formula: (Discharged Cured Patients / [Discharged + Deceased]) × 100
                  </p>
                </div>

                {/* Mortality Benchmark Card */}
                <div className="bg-white p-6 rounded-2xl border border-[#E3EAF0] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#203247] text-lg">Mortality Rate Tracking</h3>
                      <p className="text-xs text-[#718096]">Upper Limit Benchmark: 15% Maximum</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      parseFloat(outcomeStats.mortalityRate) <= 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {parseFloat(outcomeStats.mortalityRate) <= 15 ? 'Within Limit' : 'Exceeds Benchmark'}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-[#203247]">{outcomeStats.mortalityRate}%</span>
                    <span className="text-xs text-gray-500 font-medium">Denominator: {outcomeStats.totalOutcomes} completed outcomes</span>
                  </div>

                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${parseFloat(outcomeStats.mortalityRate) <= 15 ? 'bg-[#2A9D8F]' : 'bg-[#D85C5C]'}`}
                      style={{ width: `${Math.min(100, parseFloat(outcomeStats.mortalityRate))}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Formula: (Deceased Patients / [Discharged + Deceased]) × 100
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ==================== SCREEN 9: ACTIVITY & AUDIT LOG ==================== */}
          {activeTab === 'activity' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#203247]">System Audit Trail</h2>
                  <p className="text-sm text-[#718096]">Immutable activity records for temperature changes, approvals, and discharges.</p>
                </div>
                <button 
                  onClick={() => showToast('Audit trail log exported to CSV.')}
                  className="px-4 py-2 bg-[#247BA0] text-white text-xs font-bold rounded-xl hover:bg-[#1d6483]"
                >
                  Export Log
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#E3EAF0] shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#EAF4FA]/60 text-[#203247] text-xs uppercase font-bold border-b border-[#E3EAF0]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">User & Role</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3EAF0]">
                    {appData.logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-xs font-mono text-gray-500">{log.timestamp}</td>
                        <td className="py-3 px-4 text-xs font-bold text-[#203247]">
                          {log.user} <span className="text-gray-400 font-normal">({log.role})</span>
                        </td>
                        <td className="py-3 px-4 text-xs font-bold text-[#247BA0]">{log.action}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== SCREEN 10: SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-[#203247]">Facility Settings</h2>
                <p className="text-sm text-[#718096]">System parameters, capacity limits, and clinical thresholds.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E3EAF0] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#203247]">Clinical Thresholds</h3>
                  {currentRole !== 'Administrator' && (
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-300">
                      Requires Administrator Privileges
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#718096]">Fever Threshold (°C)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      disabled={currentRole !== 'Administrator'}
                      value={appData.facilityConfig.feverThreshold}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setAppData(prev => ({
                          ...prev,
                          facilityConfig: { ...prev.facilityConfig, feverThreshold: val }
                        }));
                      }}
                      className="w-full mt-1 p-2 border border-[#E3EAF0] rounded-xl font-bold text-sm disabled:bg-gray-100 disabled:text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#718096]">Max Facility Capacity (Beds)</label>
                    <input 
                      type="number" 
                      disabled
                      value={appData.facilityConfig.maxCapacity}
                      className="w-full mt-1 p-2 border border-[#E3EAF0] rounded-xl font-bold text-sm bg-gray-100 text-gray-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* ADD PATIENT MODAL */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E3EAF0]">
            <div className="flex justify-between items-center pb-4 border-b border-[#E3EAF0]">
              <h3 className="text-lg font-bold text-[#203247]">Admit New Quarantine Patient</h3>
              <button onClick={() => setShowAddPatientModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-[#718096]">Patient Full Name</label>
                <input required name="name" type="text" placeholder="e.g. John Doe" className="w-full mt-1 p-2.5 border rounded-xl text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#718096]">Age</label>
                  <input required name="age" type="number" min="1" max="120" placeholder="e.g. 42" className="w-full mt-1 p-2.5 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#718096]">Gender</label>
                  <select name="gender" className="w-full mt-1 p-2.5 border rounded-xl text-sm">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#718096]">Assign Room (Available Beds)</label>
                <select name="room" className="w-full mt-1 p-2.5 border rounded-xl text-sm">
                  {Array.from({ length: 74 }, (_, i) => `Room ${101 + i}`)
                    .filter(r => !occupiedRooms.has(r))
                    .map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#718096]">Admission Clinical Notes</label>
                <textarea name="notes" placeholder="Initial symptoms..." className="w-full mt-1 p-2.5 border rounded-xl text-sm h-20" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddPatientModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#247BA0] text-white rounded-xl text-xs font-bold">Admit Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD TEMPERATURE MODAL */}
      {showTempModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E3EAF0]">
            <div className="flex justify-between items-center pb-4 border-b border-[#E3EAF0]">
              <h3 className="text-lg font-bold text-[#203247]">Record Temperature</h3>
              <button onClick={() => setShowTempModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-[#718096]">Select Patient</label>
                <select 
                  value={tempModalPatientId} 
                  onChange={(e) => setTempModalPatientId(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl text-sm font-bold"
                >
                  {activePatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.room})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#718096]">Temperature Reading (°C)</label>
                <input 
                  id="tempValInput" 
                  type="number" 
                  step="0.1" 
                  defaultValue="36.8" 
                  className="w-full mt-1 p-3 border rounded-xl text-xl font-extrabold text-[#203247]" 
                />
                <p className="text-[11px] text-gray-500 mt-1">&gt; 37.5°C will reset consecutive fever-free count.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#718096]">Observation Notes</label>
                <input id="tempNotesInput" type="text" placeholder="e.g. Mild chills reported" className="w-full mt-1 p-2.5 border rounded-xl text-sm" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowTempModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button 
                  type="button" 
                  onClick={() => {
                    const temp = document.getElementById('tempValInput').value;
                    const notes = document.getElementById('tempNotesInput').value;
                    handleRecordTemperature(tempModalPatientId, temp, notes);
                  }}
                  className="px-4 py-2 bg-[#2A9D8F] text-white rounded-xl text-xs font-bold"
                >
                  Save Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR REVIEW MODAL */}
      {showDoctorReviewModal && reviewPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E3EAF0]">
            <div className="flex justify-between items-center pb-4 border-b border-[#E3EAF0]">
              <div>
                <h3 className="text-lg font-bold text-[#203247]">Clinical Recovery Review</h3>
                <p className="text-xs text-gray-500">{reviewPatient.name} ({reviewPatient.room})</p>
              </div>
              <button onClick={() => setShowDoctorReviewModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                ✓ Patient has completed 3 consecutive days without fever (&le; 37.5°C).
              </div>

              <div>
                <label className="text-xs font-bold text-[#718096]">Doctor Decision Notes</label>
                <textarea 
                  id="doctorNotesInput" 
                  defaultValue="Patient is asymptomatic and meets the 3-day fever-free discharge criterion."
                  className="w-full mt-1 p-2.5 border rounded-xl text-sm h-24"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  onClick={() => {
                    const notes = document.getElementById('doctorNotesInput').value;
                    handleDoctorDecision(reviewPatient.id, 'deferred', notes);
                  }}
                  className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600"
                >
                  Defer Discharge
                </button>

                <button 
                  onClick={() => {
                    const notes = document.getElementById('doctorNotesInput').value;
                    handleDoctorDecision(reviewPatient.id, 'approved', notes);
                  }}
                  className="px-4 py-2.5 bg-[#26966F] text-white rounded-xl text-xs font-bold hover:bg-[#1e7858]"
                >
                  Approve Discharge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}