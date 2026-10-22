import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function AuthModal({ isOpen, onClose, role = 'user', onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: role === 'admin' ? 'admin@fixmobile.com' : '',
    phone: '',
    password: role === 'admin' ? 'admin123' : '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill in all registration fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        const res = await api.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        onAuthSuccess(res.user, res.token);
        onClose();
      } else {
        const res = await api.login({
          email: formData.email,
          password: formData.password,
          role
        });
        onAuthSuccess(res.user, res.token);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-pastel border border-sky-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-sky-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            {role === 'admin' ? <ShieldCheck className="w-5 h-5 text-sky-200" /> : <User className="w-5 h-5 text-sky-200" />}
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-100">
              {role === 'admin' ? 'Admin Portal Authentication' : 'Customer Account'}
            </span>
          </div>

          <h3 className="text-2xl font-bold">
            {role === 'admin' 
              ? 'Secure Admin Login' 
              : isRegister 
                ? 'Create Customer Account' 
                : 'Welcome Back'}
          </h3>
          <p className="text-xs text-sky-100 mt-1">
            {role === 'admin'
              ? 'Enter authorized shop manager credentials'
              : isRegister
                ? 'Register to book, track repairs, and manage invoices'
                : 'Sign in to access your repair bookings & support'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isRegister && role === 'user' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder={role === 'admin' ? 'admin@fixmobile.com' : 'user@example.com'}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          {isRegister && role === 'user' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          {isRegister && role === 'user' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-200 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>{isRegister ? 'Complete Registration' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {role === 'user' && (
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
              {isRegister ? (
                <span>Already have an account? <button type="button" onClick={() => { setIsRegister(false); setError(''); }} className="text-brand-600 font-bold hover:underline">Sign In</button></span>
              ) : (
                <span>New to FixMobile? <button type="button" onClick={() => { setIsRegister(true); setError(''); }} className="text-brand-600 font-bold hover:underline">Create Account</button></span>
              )}
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
