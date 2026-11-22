import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, UserCheck, Stethoscope, ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data && data.user) {
        if (data.user.role === 'patient') navigate('/patient/dashboard');
        else if (data.user.role === 'doctor') navigate('/doctor/dashboard');
        else if (data.user.role === 'admin') navigate('/admin/dashboard');
      }
    } catch (err) {
      // toast shown in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Icon Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-medivault-800 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <span className="font-black text-2xl tracking-tight text-medivault-900">
            Medi<span className="text-cyan-500">Vault</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Health Vault
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your authorized credentials or select a one-click demo profile below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Quick Demo Logins Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[10px]">
              Instant Demo Access (Click to autofill):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('patient@medivault.io')}
                className="p-2 bg-white rounded-lg border border-slate-200 hover:border-cyan-500 text-left cursor-pointer transition shadow-xs"
              >
                <div className="font-bold text-medivault-900 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-600" /> Patient
                </div>
                <div className="text-[10px] text-slate-500 truncate">Eleanor Sterling</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('sarah.jenkins@medivault.io')}
                className="p-2 bg-white rounded-lg border border-slate-200 hover:border-blue-500 text-left cursor-pointer transition shadow-xs"
              >
                <div className="font-bold text-medivault-900 flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" /> Doctor
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Sarah Jenkins</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('elena.rostova@medivault.io')}
                className="p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-500 text-left cursor-pointer transition shadow-xs"
              >
                <div className="font-bold text-medivault-900 flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-amber-600" /> Unverified Doctor
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Elena Rostova</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('admin@medivault.io')}
                className="p-2 bg-white rounded-lg border border-slate-200 hover:border-purple-500 text-left cursor-pointer transition shadow-xs"
              >
                <div className="font-bold text-medivault-900 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> Admin
                </div>
                <div className="text-[10px] text-slate-500 truncate">Administrator</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@medivault.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medivault-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-cyan-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medivault-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to MediVault
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-500">
            <div>
              Need a patient health record?{' '}
              <Link to="/register/patient" className="text-medivault-800 font-bold hover:underline">
                Register as Patient
              </Link>
            </div>
            <div>
              Are you a medical doctor?{' '}
              <Link to="/register/doctor" className="text-medivault-800 font-bold hover:underline">
                Apply for Doctor Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
