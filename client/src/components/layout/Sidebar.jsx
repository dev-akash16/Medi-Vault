import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Activity,
  FileText,
  Clock,
  HeartPulse,
  Pill,
  Calendar,
  AlertCircle,
  FolderOpen,
  KeyRound,
  User,
  Settings,
  LogOut,
  Users,
  Search,
  CheckCircle,
  FileCheck,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const patientNavItems = [
    { label: 'Dashboard', icon: Activity, path: '/patient/dashboard' },
    { label: 'My Medical History', icon: FileText, path: '/patient/history' },
    { label: 'Health Timeline', icon: Clock, path: '/patient/timeline' },
    { label: 'Conditions & Diseases', icon: HeartPulse, path: '/patient/conditions' },
    { label: 'Consultations', icon: Stethoscope, path: '/patient/consultations' },
    { label: 'Prescriptions', icon: Pill, path: '/patient/prescriptions' },
    { label: 'Medications', icon: Pill, path: '/patient/medications' },
    { label: 'Lab Reports', icon: FileCheck, path: '/patient/lab-reports' },
    { label: 'Health Vitals', icon: Activity, path: '/patient/vitals' },
    { label: 'Allergies', icon: AlertCircle, path: '/patient/allergies' },
    { label: 'Appointments', icon: Calendar, path: '/patient/appointments' },
    { label: 'Document Vault', icon: FolderOpen, path: '/patient/documents' },
    { label: 'Access Permissions', icon: KeyRound, path: '/patient/access-permissions' },
    { label: 'Export Records', icon: Download, path: '/patient/export' },
    { label: 'My Profile', icon: User, path: '/patient/profile' },
  ];

  const doctorNavItems = [
    { label: 'Dashboard', icon: Activity, path: '/doctor/dashboard' },
    { label: 'My Patients', icon: Users, path: '/doctor/patients' },
    { label: 'Patient Search', icon: Search, path: '/doctor/search' },
    { label: 'Consultations', icon: Stethoscope, path: '/doctor/consultations' },
    { label: 'Prescriptions', icon: Pill, path: '/doctor/prescriptions' },
    { label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { label: 'Doctor Profile', icon: User, path: '/doctor/profile' },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', icon: Activity, path: '/admin/dashboard' },
    { label: 'User Accounts', icon: Users, path: '/admin/users' },
    { label: 'Doctor Verification', icon: CheckCircle, path: '/admin/verifications' },
    { label: 'Audit Logs', icon: FileText, path: '/admin/audit-logs' },
  ];

  let navItems = patientNavItems;
  if (user?.role === 'doctor') navItems = doctorNavItems;
  if (user?.role === 'admin') navItems = adminNavItems;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1728] text-slate-300 border-r border-slate-800 selection:bg-medivault-700">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-medivault-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                Medi<span className="text-cyan-400">Vault</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Digital Health EHR</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role & ID Indicator */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-300">
              {user?.role} Portal
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
            {profile?.patientId || profile?.doctorId || 'ADMIN'}
          </span>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-medivault-700 to-medivault-800 text-white shadow-md border-l-4 border-cyan-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-rose-400" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0B1728] z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
