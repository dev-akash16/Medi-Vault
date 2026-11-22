import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, Stethoscope, Pill, FileCheck, KeyRound, Activity, Download, Database } from 'lucide-react';

export const FeaturesPage = () => {
  const featureList = [
    {
      title: 'Universal Patient Health ID',
      desc: 'Every patient is provisioned a permanent identity (e.g. MV-PAT-2026-0001) that travels across all clinics, hospitals, and outpatient care centers.',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Chronological Health Timeline',
      desc: 'Seamless unified feed detailing consultations, medications started, completed courses, lab tests, and hospitalizations, with newest-first or oldest-first sorting.',
      icon: Clock,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      title: 'Full Clinical Consultations',
      desc: 'Attending physicians can record chief complaints, review existing allergies before prescribing, document vitals, and link diagnoses.',
      icon: Stethoscope,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Digital Prescription Builder',
      desc: 'Formulation with precise strengths, frequencies, routes, duration, refills, and food instructions, permanently tied to the consultation encounter.',
      icon: Pill,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Diagnostic Test & Report Vault',
      desc: 'Store structured test parameters (CMP, Lipid panels, Blood glucose) alongside original laboratory PDF documents with reference range highlighting.',
      icon: FileCheck,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Dynamic Consent Management',
      desc: 'Patients review doctor access requests with clear clinical reasons, approve specific scopes of data, and can revoke doctor access at any time.',
      icon: KeyRound,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Longitudinal Vitals Analytics',
      desc: 'Interactive Recharts graphs tracking blood pressure trends, heart rate, and body mass index, clearly differentiating clinical vs self-reported data.',
      icon: Activity,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      title: 'Comprehensive Health Export',
      desc: 'Export the complete medical dossier as a clean, standardized, printable medical record format with official verification signatures.',
      icon: Download,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      title: 'Immutable Audit Trail',
      desc: 'Every sensitive view, access request, prescription issuance, and clinical modification is logged with actor metadata and timestamp.',
      icon: Database,
      color: 'text-slate-700 bg-slate-100',
    },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <div className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">Enterprise Healthcare SaaS</span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            MediVault Core Capabilities
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            A comprehensive, interoperable health records platform connecting patients and medical professionals.
          </p>
        </div>
      </div>

      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-medivault-900 to-medivault-800 rounded-3xl text-white text-center space-y-4">
          <h3 className="text-2xl font-bold">Ready to take control of your health history?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of patients who never worry about forgotten prescriptions, lost lab slips, or fragmented medical care.
          </p>
          <div className="pt-2">
            <Link to="/register/patient">
              <Button variant="teal" size="lg">Create Free Patient Account</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
