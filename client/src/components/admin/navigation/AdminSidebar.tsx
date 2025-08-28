import React from 'react';
import { Users, AlertTriangle, Settings, Zap, ImageIcon } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: "dashboard" | "albums" | "users" | "reports" | "settings") => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  return (
    <nav className="w-64 bg-[#05637b] shadow-2xl min-h-screen flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-[#f8b400] rounded-lg flex items-center justify-center">
            <Zap className="text-[#052b3e] w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white">MATCHBOX</h1>
            <p className="text-sm text-white/70">Admin Panel</p>
          </div>
        </div>

        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => onSectionChange("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "dashboard" 
                  ? "text-white bg-[#f8b400]/20 border border-[#f8b400]/30" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className={`w-4 h-4 ${activeSection === "dashboard" ? "text-[#f8b400]" : "group-hover:text-[#f8b400]"}`} />
              <span className={activeSection === "dashboard" ? "font-medium" : ""}>Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSectionChange("albums")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "albums" 
                  ? "text-white bg-[#f8b400]/20 border border-[#f8b400]/30" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${activeSection === "albums" ? "text-[#f8b400]" : "group-hover:text-[#f8b400]"}`} />
              <span className={activeSection === "albums" ? "font-medium" : ""}>Album</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSectionChange("users")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "users" 
                  ? "text-white bg-[#f8b400]/20 border border-[#f8b400]/30" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className={`w-4 h-4 ${activeSection === "users" ? "text-[#f8b400]" : "group-hover:text-[#f8b400]"}`} />
              <span className={activeSection === "users" ? "font-medium" : ""}>Utenti</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSectionChange("reports")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "reports" 
                  ? "text-white bg-[#f8b400]/20 border border-[#f8b400]/30" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <AlertTriangle className={`w-4 h-4 ${activeSection === "reports" ? "text-[#f8b400]" : "group-hover:text-[#f8b400]"}`} />
              <span className={activeSection === "reports" ? "font-medium" : ""}>Segnalazioni</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSectionChange("settings")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "settings" 
                  ? "text-white bg-[#f8b400]/20 border border-[#f8b400]/30" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Settings className={`w-4 h-4 ${activeSection === "settings" ? "text-[#f8b400]" : "group-hover:text-[#f8b400]"}`} />
              <span className={activeSection === "settings" ? "font-medium" : ""}>Impostazioni</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
