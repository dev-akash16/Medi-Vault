import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to our healthcare support team.');
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <div className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact MediVault Support
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Our healthcare technology engineers and patient care specialists are available 24/7.
          </p>
        </div>
      </div>

      <div className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Info */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Reach Out Directly</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Have questions regarding doctor onboarding, clinic system integrations, or patient record portability?
            </p>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <Mail className="w-5 h-5 text-medivault-700 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-900">Email Support</span>
                  <span>support@medivault.io</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <Phone className="w-5 h-5 text-medivault-700 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-900">Toll-Free Helpline</span>
                  <span>+1 (800) 555-VAULT (8285)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <MapPin className="w-5 h-5 text-medivault-700 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-900">Global Headquarters</span>
                  <span>450 Lexington Ave, Suite 900, New York, NY 10017</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-card">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Message Delivered</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Our healthcare support desk has received your ticket. A representative will respond within 2 hours.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Eleanor Sterling"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Question about record export"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our clinical support team assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <Button variant="primary" type="submit" size="lg" className="w-full" icon={Send}>
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
