import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { UserPlus, KeyRound, Stethoscope, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Sign Up & Obtain Your Unique Patient ID',
      desc: 'Create your account in seconds. You are assigned a unique lifetime healthcare identifier (e.g. MV-PAT-2026-0001) where all previous and future health encounters reside.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'Grant Explicit Consent to Your Doctor',
      desc: 'When visiting a new doctor or specialist, share your Patient ID. Your doctor requests clinical access with an explicit reason. You approve access via your dashboard with chosen scopes.',
      icon: KeyRound,
    },
    {
      num: '03',
      title: 'Consultation, Prescription & Seamless Follow-up',
      desc: 'Your doctor reviews your history, records clinical vitals, issues electronic prescriptions, and logs diagnoses. All updates are permanently saved without erasing previous records.',
      icon: Stethoscope,
    },
    {
      num: '04',
      title: 'Total Ownership & Revocation at Any Time',
      desc: 'Once your treatment is complete or if you change clinics, you can instantly revoke the doctor’s access permissions with a single tap. Your records remain private and secure.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <div className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">The Connected Journey</span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How MediVault Works
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            From registration to consultation and lifelong health tracking — seamless, patient-controlled healthcare.
          </p>
        </div>
      </div>

      <div className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-card flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-medivault-800 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                  {s.num}
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="hidden md:flex w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center text-slate-400 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link to="/register/patient">
            <Button variant="primary" size="xl">
              Get Started Now — It's Free
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
