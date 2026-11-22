import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Shield, Target, Users2, Lock, HeartHandshake } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <div className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">Our Mission</span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About MediVault
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Empowering patients with absolute ownership over their lifetime medical records and enabling doctors to deliver connected care.
          </p>
        </div>
      </div>

      <div className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">The Problem We Are Solving</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In modern healthcare, patients interact with dozens of different specialists, general practitioners, laboratories, and surgical centers throughout their lives. Each of these institutions keeps a disconnected fragment of the patient’s health history.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            MediVault was founded on a simple yet revolutionary truth: <strong>the patient is the center of their healthcare journey</strong>. Your medical records should not be locked in legacy hospital silos. They belong to you, accessible to whoever you authorize to treat you, preserved permanently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Patient Centricity</h3>
            <p className="text-xs text-slate-500">Every decision, consent rule, and workflow prioritizes the patient’s dignity and control.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Uncompromising Privacy</h3>
            <p className="text-xs text-slate-500">Rigorous encryption, auditable role-based permissions, and strict zero-unauthorized-access policies.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Clinical Integrity</h3>
            <p className="text-xs text-slate-500">Completed doctor consultations and diagnoses are preserved permanently with auditable amendment trails.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
