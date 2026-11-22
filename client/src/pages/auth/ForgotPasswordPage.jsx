import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password recovery instructions generated.');
    } catch (err) {
      toast.error('Unable to process recovery request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered email address to receive secure recovery steps.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3 text-xs">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Recovery Sent</h4>
              <p className="text-slate-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, recovery instructions have been sent. For demo accounts, the password is <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-800">Password123!</code>.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="sm" icon={ArrowLeft}>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="patient@medivault.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                  />
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
                Send Recovery Instructions
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
