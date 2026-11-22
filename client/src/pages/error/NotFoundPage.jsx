import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../../components/common/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-medivault-50 border border-medivault-200 flex items-center justify-center text-medivault-700 shadow-sm mb-6">
        <Shield className="w-8 h-8" />
      </div>

      <span className="text-sm font-bold tracking-widest text-cyan-600 uppercase mb-2">Error 404</span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-md">
        Medical Record or Page Not Found
      </h1>
      <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-md">
        The record, consultation file, or clinical destination you requested does not exist or may have been relocated.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="primary" className="flex items-center gap-2 w-full justify-center">
            <Home className="w-4 h-4" />
            MediVault Home
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-xs text-slate-400">
        MediVault Unified Digital Health Records Platform &bull; HIPAA Compliant
      </div>
    </div>
  );
};

export default NotFoundPage;
