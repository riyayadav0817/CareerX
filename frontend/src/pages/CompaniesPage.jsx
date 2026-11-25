import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Building2,
  Search,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Users,
  Briefcase
} from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (industry && industry !== 'All') queryParams.append('industry', industry);

        const res = await api.get(`/companies?${queryParams.toString()}`);
        if (res.data.success) {
          setCompanies(res.data.companies);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [search, industry]);

  const industriesList = [
    'All',
    'Technology & Cloud',
    'Fintech & Payments',
    'Travel & Hospitality',
    'Artificial Intelligence',
    'Music & Audio Streaming',
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
            Employers Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Top Hiring Companies
          </h1>
          <p className="text-slate-600 text-sm mt-3">
            Discover verified tech organizations, SaaS innovators, and global scale-ups actively hiring top talent.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/90 mb-10 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies by name..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="w-full sm:w-1/3">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
              >
                {industriesList.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-slate-500">Discovering companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4 max-w-md mx-auto">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No companies found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or industry filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div
                key={comp._id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    {comp.logo ? (
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="w-14 h-14 rounded-2xl object-contain p-2 border border-slate-100 bg-slate-50"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xl">
                        <Building2 className="w-7 h-7" />
                      </div>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                      {comp.openJobsCount || 0} Openings
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                      <span>{comp.name}</span>
                      {comp.verified && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp.location || 'HQ'}</span>
                      <span>•</span>
                      <span>{comp.industry || 'Technology'}</span>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                      {comp.description || 'Pioneering modern tech and enterprise solutions for customers worldwide.'}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 inline" /> {comp.companySize || '500+'} employees
                  </span>
                  <Link
                    to={`/companies/${comp._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>View Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
