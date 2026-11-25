import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get in touch with us
          </h1>
          <p className="text-slate-600 text-sm">
            Have questions about hiring on CareerX, pricing plans, or need support with your account? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">Email Us</h4>
              <p className="text-xs text-slate-500">support@careerx.com</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
              <Phone className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">Call Support</h4>
              <p className="text-xs text-slate-500">+1 (800) 456-7890</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">Headquarters</h4>
              <p className="text-xs text-slate-500">555 Mission St, San Francisco, CA</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900 text-lg">Message Delivered</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you! Our support team will review your inquiry and get back to you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
