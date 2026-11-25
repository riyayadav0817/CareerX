import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>

        <h3 className="font-bold text-slate-900 text-base pt-2">1. Acceptance of Terms</h3>
        <p>By accessing or using CareerX, you agree to be bound by these Terms of Service and all applicable federal, state, and local laws and regulations.</p>

        <h3 className="font-bold text-slate-900 text-base pt-2">2. Candidate and Recruiter Responsibilities</h3>
        <p>Users must provide accurate, truthful information in their profiles, job descriptions, resumes, and communication. Inappropriate listings, spam, fraudulent compensation claims, or discriminatory content will result in immediate termination.</p>

        <h3 className="font-bold text-slate-900 text-base pt-2">3. Intellectual Property</h3>
        <p>All trademarks, logos, design layouts, and software architectures on CareerX belong to their respective owners. Content submitted by employers remains their property.</p>
      </div>
    </div>
  );
}
