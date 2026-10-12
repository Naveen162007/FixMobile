import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, FileText, Camera, Upload, AlertCircle, Save, Smartphone } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { getStatusBadgeClass } from '../utils/formatters';

export default function TechnicianDashboard({ currentUser }) {
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Check-in form state
  const [screenCondition, setScreenCondition] = useState('Shattered front glass, touch responsive');
  const [bodyCondition, setBodyCondition] = useState('Minor corner scuffs');
  const [cameraCondition, setCameraCondition] = useState('Clear optics');
  const [scratchesNotes, setScratchesNotes] = useState('Hairline rear scratches');
  const [accessories, setAccessories] = useState('SIM tray included, no case');
  const [imei, setImei] = useState('354892019485721');
  const [techNotes, setTechNotes] = useState('');
  
  const [newStatus, setNewStatus] = useState('Repair In Progress');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Fetch assigned repairs for logged-in technician
    const techId = currentUser?.id || 2;
    fetchApi(`/bookings?technician_id=${techId}`)
      .then(jobs => {
        setAssignedJobs(jobs);
        if (jobs.length > 0) setSelectedJob(jobs[0]);
      })
      .catch(console.error);
  }, [currentUser]);

  const handleUpdateStatus = async () => {
    if (!selectedJob) return;
    try {
      await fetchApi(`/bookings/${selectedJob.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      // Update check-in record
      await fetchApi(`/bookings/${selectedJob.id}/checkin`, {
        method: 'POST',
        body: JSON.stringify({
          screen_condition: screenCondition,
          body_condition: bodyCondition,
          camera_condition: cameraCondition,
          scratches_notes: scratchesNotes,
          accessories,
          imei,
          technician_notes: techNotes
        })
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);

      // Refresh list
      const jobs = await fetchApi(`/bookings?technician_id=${currentUser?.id || 2}`);
      setAssignedJobs(jobs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-12 bg-navy-900 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-cyanAccent">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase block">Technician Workstation</span>
              <h1 className="text-2xl font-extrabold text-white">{currentUser?.name || 'Suresh V (Senior Tech)'}</h1>
              <span className="text-xs text-emerald-400 font-bold">📍 Gandhipuram Repair Hub • Screen & Hardware Specialist</span>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-navy-950 border border-white/10 text-xs text-slate-300 font-mono">
            Assigned Queue: <strong className="text-cyanAccent">{assignedJobs.length} Repairs Active</strong>
          </div>
        </div>

        {/* Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Job List Queue */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Assigned Repair Queue</h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {assignedJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setNewStatus(job.status);
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedJob?.id === job.id
                      ? 'bg-blue-600/20 border-cyanAccent shadow-lg'
                      : 'bg-navy-800 border-white/5 hover:bg-navy-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyanAccent">{job.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-white text-sm mt-1">{job.brand} {job.model}</h4>
                  <p className="text-xs text-slate-300 font-medium">{job.service_name}</p>
                  
                  <div className="mt-2 pt-2 border-t border-white/5 flex justify-between text-[11px] text-slate-400">
                    <span>Customer: {job.customer_name}</span>
                    <span className="text-emerald-400 font-bold">{job.service_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detailed Check-in & Status Workstation */}
          {selectedJob ? (
            <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-mono block">Workstation Job #{selectedJob.id}</span>
                  <h2 className="text-2xl font-extrabold text-white">{selectedJob.brand} {selectedJob.model}</h2>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">Problem Reported: "{selectedJob.problem}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-navy-950 border border-cyanAccent/50 rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 focus:outline-none"
                  >
                    <option>Booking Confirmed</option>
                    <option>Technician Assigned</option>
                    <option>Phone Picked Up</option>
                    <option>Diagnosis</option>
                    <option>Repair In Progress</option>
                    <option>Quality Check</option>
                    <option>Ready for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Digital Check-in Record Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyanAccent" /> Digital Device Check-in Inspection Form
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Screen Condition</label>
                    <input
                      type="text"
                      value={screenCondition}
                      onChange={(e) => setScreenCondition(e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Body / Aluminium Frame</label>
                    <input
                      type="text"
                      value={bodyCondition}
                      onChange={(e) => setBodyCondition(e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Camera Glass Condition</label>
                    <input
                      type="text"
                      value={cameraCondition}
                      onChange={(e) => setCameraCondition(e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Device IMEI / Serial</label>
                    <input
                      type="text"
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Accessories Received</label>
                  <input
                    type="text"
                    value={accessories}
                    onChange={(e) => setAccessories(e.target.value)}
                    className="w-full bg-navy-800 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Technician Diagnostic Notes & Parts Swapped</label>
                  <textarea
                    value={techNotes}
                    onChange={(e) => setTechNotes(e.target.value)}
                    rows={3}
                    placeholder="Enter diagnostic steps taken, parts replaced, heating test results..."
                    className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyanAccent outline-none"
                  />
                </div>

                {savedSuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs text-center">
                    ✅ Job status & digital check-in record saved successfully!
                  </div>
                )}

                <button
                  onClick={handleUpdateStatus}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Status & Save Check-in Record</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-8 glass-panel p-12 rounded-3xl text-center text-slate-400 text-sm">
              Select a repair job from the queue to view check-in details and update repair progress.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
