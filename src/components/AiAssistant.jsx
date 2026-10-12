import React, { useState } from 'react';
import { Cpu, Sparkles, Send, Wrench, ShieldAlert, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../utils/api';

export default function AiAssistant({ onSelectCategoryForBooking }) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const samplePrompts = [
    "My phone fell into water and now display is blank",
    "Screen is cracked and touch isn't working",
    "Battery drains in 2 hours and phone heats up",
    "Charging cable feels loose and won't charge"
  ];

  const handleDiagnose = async (textToSubmit) => {
    const query = textToSubmit || inputPrompt;
    if (!query) return;

    setLoading(true);
    try {
      const res = await api.diagnoseAi(query);
      setAiResponse(res);
    } catch (err) {
      console.error('AI diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-sky-600 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-pastel relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Cpu className="w-4 h-4 text-sky-200" />
            <span>FixMobile AI Diagnostic Engine</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold mb-2">
            Smart AI Repair Assistant
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            Describe your phone problem in plain language (e.g. "my display went black after a drop"), and our AI will immediately analyze symptoms, estimate repair cost, and provide care steps.
          </p>
        </div>
      </div>

      {/* Input Box Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pastel border border-sky-100 space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Describe Your Phone Problem
        </label>

        <div className="relative">
          <textarea
            rows={3}
            placeholder="Describe what happened or what problem you're experiencing with your phone..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            onClick={() => handleDiagnose()}
            disabled={loading || !inputPrompt.trim()}
            className="absolute right-3 bottom-3 py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            {loading ? 'Analyzing...' : (
              <>
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>AI Analyze</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Prompt Chips */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Try sample queries:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setInputPrompt(p);
                  handleDiagnose(p);
                }}
                className="py-1.5 px-3 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-700 text-xs transition-colors border border-slate-200"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Diagnostic Output */}
      {aiResponse && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pastel border border-sky-100 space-y-6 animate-fade-in">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">AI Diagnosis Results</h3>
              <p className="text-xs text-slate-500">Instant AI preliminary evaluation</p>
            </div>
          </div>

          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
            {aiResponse.aiExplanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Suggested Category</span>
              <p className="font-extrabold text-slate-900 text-base">{aiResponse.suggestedCategory}</p>
              <p className="text-xs text-slate-500">{aiResponse.recommendedService}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Cost Range</span>
              <p className="font-extrabold text-brand-700 text-xl">{aiResponse.estimatedCostRange}</p>
              <p className="text-[10px] text-slate-500">Final price confirmed after technician diagnosis</p>
            </div>
          </div>

          {/* Emergency First-Aid Advice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Recommended Emergency Care Advice:</span>
            </div>
            <p className="leading-relaxed">{aiResponse.emergencyAdvice}</p>
          </div>

          {/* Action CTA to Book directly */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onSelectCategoryForBooking(aiResponse.suggestedCategory)}
              className="py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md shadow-brand-200 flex items-center gap-2 transition-all"
            >
              <span>Proceed to Book {aiResponse.suggestedCategory}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
