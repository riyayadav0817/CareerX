import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Search,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

export default function CompanyPrepPage() {
  const [tracks, setTracks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const res = await api.get('/prep/companies');
        if (res.data.success) {
          setTracks(res.data.tracks || []);
        }
      } catch (err) {
        console.error('Error fetching company tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const filtered = tracks.filter((t) =>
    t.companyName.toLowerCase().includes(search.toLowerCase()) ||
    t.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="surface-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-full bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none"></div>
          <div className="max-w-2xl space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tailored Campus Recruitment Blueprints</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Company-Specific Placement Preparation
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Ace your upcoming placement drives with company-specific selection processes, test patterns, syllabus topics, and practice interview questions.
            </p>
          </div>
        </div>

        {/* Disclaimer Note (Mandatory as per requirements) */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Educational Disclaimer:</strong> All preparation tracks on CareerX are designed independently by technical educators for training and mock practice. They do not constitute official examination papers of the respective organizations.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs max-w-xl mx-auto">
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies (TCS, Infosys, Amazon, Google, etc.)..."
              className="w-full bg-transparent text-xs sm:text-sm outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-slate-500">Loading company preparation tracks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No company track found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((trk) => (
              <div
                key={trk._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    {trk.logo ? (
                      <img
                        src={trk.logo}
                        alt={trk.companyName}
                        className="w-12 h-12 rounded-2xl object-contain p-1.5 border border-slate-100 bg-slate-50 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {trk.companyName}
                      </h3>
                      <p className="text-[11px] text-indigo-600 font-semibold">{trk.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {trk.overview}
                  </p>

                  {/* Highlights */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{trk.selectionProcess?.length || 3} Selection Stages</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                      <span>{trk.examPattern?.length || 3} Exam Pattern Sections</span>
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100">
                  <Link
                    to={`/company-prep/${trk.slug}`}
                    className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <span>View Preparation Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
