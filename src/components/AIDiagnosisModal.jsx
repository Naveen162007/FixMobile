import React, { useState } from 'react';
import { Sparkles, X, Check, HelpCircle, Upload, Smartphone, AlertCircle, ArrowRight } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { formatINR } from '../utils/formatters';

export default function AIDiagnosisModal({ isOpen, onClose, onProceedToBooking }) {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 14');
  
  const [symptoms, setSymptoms] = useState({
    screen_cracked: false,
    charging: true,
    overheat: false,
    camera_blurry: false,
    restart: false
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleDiagnose = async () => {
    setLoading(true);
    try {
      const activeSymptoms = [];
      if (symptoms.screen_cracked) activeSymptoms.push('screen_cracked_yes');
      if (!symptoms.charging) activeSymptoms.push('charging_no');
      if (symptoms.overheat) activeSymptoms.push('overheat_yes');
      if (symptoms.camera_blurry) activeSymptoms.push('camera_blurry_yes');
      if (symptoms.restart) activeSymptoms.push('restart_yes');

      const data = await fetchApi('/ai/diagnose', {
        method: 'POST',
        body: JSON.stringify({
          brand,
          model,
          symptoms: activeSymptoms,
          hasPhoto: !!photo
        })
      });

      setResult(data);
      setStep(3);
    } catch (err) {
      console.error('AI diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-navy-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-md">
            <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">AI Phone Symptom Diagnosis</h2>
            <p className="text-xs text-slate-400">Not sure what's wrong? Let Kovai AI analyze symptoms.</p>
          </div>
        </div>

        {/* STEP 1: Select Brand & Model */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-200 border-b border-white/10 pb-2">
              Step 1: Select Your Device
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                >
                  <option>Apple</option>
                  <option>Samsung</option>
                  <option>OnePlus</option>
                  <option>Xiaomi</option>
                  <option>Redmi</option>
                  <option>Vivo</option>
                  <option>Oppo</option>
                  <option>Realme</option>
                  <option>Google</option>
                  <option>Motorola</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. iPhone 14, Galaxy S23"
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all"
            >
              <span>Next: Answer Symptoms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Symptom Questions */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-white/10 pb-2">
              Step 2: Tell us what's happening
            </h3>

            <div className="space-y-3">
              
              {/* Q1 */}
              <div className="flex items-center justify-between p-3.5 bg-navy-800 rounded-xl border border-white/5">
                <span className="text-xs font-medium text-slate-200">Is the front screen cracked or broken?</span>
                <input
                  type="checkbox"
                  checked={symptoms.screen_cracked}
                  onChange={(e) => setSymptoms({ ...symptoms, screen_cracked: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Q2 */}
              <div className="flex items-center justify-between p-3.5 bg-navy-800 rounded-xl border border-white/5">
                <span className="text-xs font-medium text-slate-200">Does your phone charge when plugged in?</span>
                <button
                  onClick={() => setSymptoms({ ...symptoms, charging: !symptoms.charging })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    symptoms.charging ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30' : 'bg-rose-900/60 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {symptoms.charging ? 'Yes (Charges)' : 'No (Won\'t Charge)'}
                </button>
              </div>

              {/* Q3 */}
              <div className="flex items-center justify-between p-3.5 bg-navy-800 rounded-xl border border-white/5">
                <span className="text-xs font-medium text-slate-200">Does the phone overheat excessively?</span>
                <input
                  type="checkbox"
                  checked={symptoms.overheat}
                  onChange={(e) => setSymptoms({ ...symptoms, overheat: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Q4 */}
              <div className="flex items-center justify-between p-3.5 bg-navy-800 rounded-xl border border-white/5">
                <span className="text-xs font-medium text-slate-200">Is the camera preview blurry or fuzzy?</span>
                <input
                  type="checkbox"
                  checked={symptoms.camera_blurry}
                  onChange={(e) => setSymptoms({ ...symptoms, camera_blurry: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Q5 */}
              <div className="flex items-center justify-between p-3.5 bg-navy-800 rounded-xl border border-white/5">
                <span className="text-xs font-medium text-slate-200">Does the phone restart automatically?</span>
                <input
                  type="checkbox"
                  checked={symptoms.restart}
                  onChange={(e) => setSymptoms({ ...symptoms, restart: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

            </div>

            {/* Optional Damage Photo Upload */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Optional: Upload Damage Photo
              </label>
              <div className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-4 text-center bg-navy-800/40 cursor-pointer">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block">Click to attach photo of visible damage</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null)}
                  className="hidden"
                  id="modal-damage-photo"
                />
                <label htmlFor="modal-damage-photo" className="text-xs text-cyanAccent font-bold cursor-pointer underline mt-1 block">
                  {photo ? 'Photo Attached ✅' : 'Choose Image File'}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={handleDiagnose}
                disabled={loading}
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {loading ? (
                  <span>Analyzing with AI...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Diagnosis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI Diagnosis Report */}
        {step === 3 && result && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-navy-800 p-5 rounded-2xl border border-blue-500/30 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
                <span>Device Analyzed: <strong className="text-white">{brand} {model}</strong></span>
                <span className="bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">AI VERDICT</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Likely Issue Detected</span>
                <h4 className="text-lg font-extrabold text-cyanAccent">{result.possibleIssue}</h4>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-navy-900 p-3 rounded-xl border border-white/5 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Recommended</span>
                  <span className="text-xs font-bold text-white">{result.recommendedService}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Time</span>
                  <span className="text-xs font-bold text-emerald-400">{result.estimatedTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Price</span>
                  <span className="text-xs font-bold text-amber-300">{formatINR(result.estimatedCost)}</span>
                </div>
              </div>

              {result.photoAnalysisNote && (
                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-xs text-blue-200">
                  📷 <strong>Photo Analysis</strong>: {result.photoAnalysisNote}
                </div>
              )}

              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{result.disclaimer}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs"
              >
                Re-test
              </button>
              <button
                onClick={() => {
                  onClose();
                  onProceedToBooking({ brand, model, service_name: result.recommendedService });
                }}
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Book {result.recommendedService}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
