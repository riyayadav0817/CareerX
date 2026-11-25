import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Target, Users, Shield, Sparkles, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empowering the Global Tech Workforce</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            We are redefining how talent meets opportunity.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            CareerX was founded to bridge the gap between world-class builders and visionary tech enterprises. We replace traditional recruiting friction with speed, transparency, and dignity.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Radical Pay Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every job listing on CareerX features benchmarked salary ranges upfront, eliminating guessing games and awkward negotiations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Vetted & Verified Roles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our trust team screens hiring organizations and listings manually to guarantee legitimate, high-growth employment opportunities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Direct Hiring Pipelines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Candidates interface directly with engineering managers and designated talent leads, receiving live status updates at every stage.
            </p>
          </div>
        </div>

        {/* Stats banner */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Join our growing ecosystem</h3>
            <p className="text-xs text-slate-500 mt-1">Whether you are hiring 50 engineers or looking for your next career jump.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
