import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Lock, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0B1728] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-medivault-500 flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Medi<span className="text-cyan-400">Vault</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified digital health records platform securely maintaining a patient’s continuous lifetime medical history across all authorized healthcare providers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>HIPAA-aligned & Cryptographically Audited</span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Patient Portal</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/register/patient" className="hover:text-cyan-400 transition">Create Patient ID</Link></li>
              <li><Link to="/login" className="hover:text-cyan-400 transition">Patient Login</Link></li>
              <li><Link to="/features" className="hover:text-cyan-400 transition">Medical Timeline</Link></li>
              <li><Link to="/features" className="hover:text-cyan-400 transition">Consent & Revocation</Link></li>
              <li><Link to="/features" className="hover:text-cyan-400 transition">Record Export (PDF)</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Doctor Network</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/register/doctor" className="hover:text-cyan-400 transition">Doctor Registration</Link></li>
              <li><Link to="/login" className="hover:text-cyan-400 transition">Doctor Portal Login</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition">Consultation Workflow</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition">Prescription Builder</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition">Credential Verification</Link></li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Platform & Trust</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-cyan-400 transition">About MediVault</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition">Security Architecture</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Support & Emergency</Link></li>
              <li><span className="text-slate-500">Version 1.0.0 Production</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} MediVault Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Healthcare Service</span>
            <span>Security Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
