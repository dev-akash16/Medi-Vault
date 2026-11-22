import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'patient') return '/patient/dashboard';
    if (user.role === 'doctor') return '/doctor/dashboard';
    return '/admin/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medivault-800 to-cyan-500 flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-medivault-900 flex items-center">
              Medi<span className="text-cyan-500">Vault</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Unified Digital Health</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-medivault-800 transition">Home</Link>
          <Link to="/features" className="hover:text-medivault-800 transition">Features</Link>
          <Link to="/how-it-works" className="hover:text-medivault-800 transition">How It Works</Link>
          <Link to="/about" className="hover:text-medivault-800 transition">About</Link>
          <Link to="/contact" className="hover:text-medivault-800 transition">Contact</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to={getDashboardLink()}>
              <Button variant="primary" size="md" icon={ArrowRight}>
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="md">
                  Sign In
                </Button>
              </Link>
              <Link to="/register/patient">
                <Button variant="primary" size="md">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 hover:text-medivault-800"
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 hover:text-medivault-800"
          >
            Features
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 hover:text-medivault-800"
          >
            How It Works
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 hover:text-medivault-800"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 hover:text-medivault-800"
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register/patient" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
