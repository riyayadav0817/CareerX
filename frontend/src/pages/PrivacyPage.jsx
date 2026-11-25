import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>

        <h3 className="font-bold text-slate-900 text-base pt-2">1. Data We Collect</h3>
        <p>We collect account details (name, email, password hash), candidate portfolio data, skills, education, experience, and uploaded resumes to provide personalized job matching.</p>

        <h3 className="font-bold text-slate-900 text-base pt-2">2. How Your Data is Used</h3>
        <p>Your resume and application details are only transmitted to the verified hiring companies you explicitly choose to apply to. We never sell your personal contact information to third-party data brokers.</p>

        <h3 className="font-bold text-slate-900 text-base pt-2">3. Security</h3>
        <p>Passwords are hashed with bcrypt, and sensitive API routes use standard JSON Web Token encryption over SSL/TLS.</p>
      </div>
    </div>
  );
}
