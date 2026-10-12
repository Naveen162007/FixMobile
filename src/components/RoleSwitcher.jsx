import React from 'react';
import { User, Wrench, Shield, Check } from 'lucide-react';
import { fetchApi } from '../utils/api';

export default function RoleSwitcher({ currentUser, onUserChange, currentTab, setCurrentTab }) {
  const handleSwitch = async (role) => {
    try {
      const data = await fetchApi('/auth/switch-demo-role', {
        method: 'POST',
        body: JSON.stringify({ role })
      });
      localStorage.setItem('kovai_token', data.token);
      onUserChange(data.user);

      if (role === 'admin') setCurrentTab('admin-dashboard');
      else if (role === 'technician') setCurrentTab('tech-dashboard');
      else setCurrentTab('customer-dashboard');
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    }
  };

  return (
    <div className="bg-navy-900/90 border-b border-white/10 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="font-semibold text-white">Coimbatore Repair Hub Demo Mode</span>
        <span className="hidden md:inline text-slate-400">| Quick Role Switcher:</span>
      </div>

      <div className="flex items-center gap-1 bg-navy-800 p-1 rounded-lg border border-white/10">
        <button
          onClick={() => handleSwitch('customer')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentUser?.role === 'customer'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Customer View</span>
          {currentUser?.role === 'customer' && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => handleSwitch('technician')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentUser?.role === 'technician'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Technician Workstation</span>
          {currentUser?.role === 'technician' && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => handleSwitch('admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentUser?.role === 'admin'
              ? 'bg-purple-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
          {currentUser?.role === 'admin' && <Check className="w-3 h-3 ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
