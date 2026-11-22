import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Stethoscope, Lock, Mail, Phone, Award, Building, FileCheck, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const DoctorRegisterPage = () => {
  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: 'Cardiology',
    qualifications: '',
    registrationNumber: '',
    experience: '5',
    clinicName: '',
    consultationAddress: '',
    consultationFee: '150',
    bio: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerDoctor(formData);
      if (data && data.success) {
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      // toast in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-medivault-800 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <span className="font-black text-2xl tracking-tight text-medivault-900">
            Medi<span className="text-cyan-500">Vault</span>
          </span>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
          Join the MediVault Doctor Network
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Professional provider onboarding and digital clinical practice registration.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Verification Warning Notice */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Professional Medical Verification Notice:</strong>
              <p className="leading-relaxed">
                New physician accounts are provisioned with status <strong>Pending Verification</strong> until medical license and registration credentials are authenticated by system administration.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                1. Doctor Identity & Login
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Dr. Sarah Jenkins"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Professional Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="sarah.jenkins@hospital.org"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 234-5671"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($ USD)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    placeholder="150"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Medical Credentials */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                2. Medical Credentials & Specialty
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology & Diabetology">Endocrinology & Diabetology</option>
                    <option value="Pulmonology & Respiratory Care">Pulmonology & Respiratory Care</option>
                    <option value="General & Internal Medicine">General & Internal Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualifications & Degrees *</label>
                  <input
                    type="text"
                    name="qualifications"
                    required
                    placeholder="MD, FACC, Harvard Medical School"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medical Registration / License No. *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    required
                    placeholder="MED-REG-CA-89234"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Years of Clinical Experience</label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="10"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Clinic / Hospital Affiliation</label>
                  <input
                    type="text"
                    name="clinicName"
                    placeholder="Metropolitan Heart & Vascular Institute"
                    value={formData.clinicName}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Practice / Consultation Address</label>
                  <input
                    type="text"
                    name="consultationAddress"
                    placeholder="450 Lexington Ave, Suite 900, New York, NY"
                    value={formData.consultationAddress}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Biography / Clinical Focus</label>
                  <textarea
                    rows={2}
                    name="bio"
                    placeholder="Describe clinical areas of expertise and practice philosophy"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="xl"
              type="submit"
              loading={loading}
              className="w-full mt-4"
              icon={ArrowRight}
            >
              Submit Doctor Registration
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-medivault-800 font-bold hover:underline">
              Doctor Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
