import React from 'react';
import { User, BarChart3, Calendar, Stethoscope, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: User, label: 'Patient Data', active: false },
    { icon: BarChart3, label: 'Performance', active: false },
    { icon: Calendar, label: 'Appointment', active: false },
    { icon: Stethoscope, label: 'Telehealth', active: false },
    { icon: FileText, label: 'Reports', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">+</span>
          </div>
          <span className="text-emerald-400 font-semibold">CallHealth</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 px-6 py-3 cursor-pointer hover:bg-slate-800 ${
              item.active ? 'bg-slate-800 border-r-2 border-emerald-400' : ''
            }`}
          >
            <item.icon className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;