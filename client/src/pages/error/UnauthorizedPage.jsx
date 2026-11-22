import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-sm font-bold tracking-widest text-rose-600 uppercase mb-2">Access Restricted &bull; 403</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-lg">
        Clinical Authorization Required
      </h1>
      <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-md">
        You do not possess the required role or patient-granted access permission to view this medical dossier or administrative console.
      </p>

      {user && (
        <div className="mt-4 p-3 bg-slate-100 rounded-xl text-xs text-slate-600 inline-block font-mono">
          Signed in as: <strong className="text-slate-800">{user.email}</strong> (Role: <span className="uppercase font-bold text-medivault-700">{user.role}</span>)
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Link to={user?.role === 'doctor' ? '/doctor/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} className="w-full sm:w-auto">
          <Button variant="primary" className="flex items-center gap-2 w-full justify-center">
            <Lock className="w-4 h-4" />
            Go to My Portal
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-xs text-slate-400">
        MediVault Unified Digital Health Records Platform &bull; Patient Consent Protected
      </div>
    </div>
  );
};

export default UnauthorizedPage;
