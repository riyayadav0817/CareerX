import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Bookmark,
  CheckCircle,
  Building2,
  Sparkles
} from 'lucide-react';

export default function JobCard({ job, onSaveToggle, isSaved = false, onQuickApply }) {
  if (!job) return null;

  const {
    _id,
    title,
    company,
    location,
    workMode,
    jobType,
    salary,
    experienceLevel,
    skills = [],
    createdAt,
    featured,
  } = job;

  const formatSalary = () => {
    if (!salary || (!salary.min && !salary.max)) return 'Competitive';
    const minK = salary.min ? `$${Math.round(salary.min / 1000)}k` : '';
    const maxK = salary.max ? `$${Math.round(salary.max / 1000)}k` : '';
    if (minK && maxK) return `${minK} - ${maxK} / yr`;
    if (minK) return `From ${minK} / yr`;
    return `Up to ${maxK} / yr`;
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return '1mo+ ago';
  };

  return (
    <div
      className={`group relative rounded-2xl p-6 transition-all duration-300 bg-white border ${
        featured
          ? 'border-indigo-200/90 shadow-md shadow-indigo-100/50 hover:shadow-xl hover:border-indigo-400'
          : 'border-slate-200/90 shadow-soft-sm hover:shadow-lg hover:border-indigo-200'
      } flex flex-col justify-between`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>FEATURED</span>
        </div>
      )}

      <div>
        {/* Top Header: Company info & Bookmark Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {company?.logo ? (
              <img
                src={company.logo}
                alt={company.name || 'Company'}
                className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-100 bg-slate-50 shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=100&q=80';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <Link
                to={`/companies/${company?._id || ''}`}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <span>{company?.name || 'Top Tier SaaS'}</span>
                {company?.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100 inline" />
                )}
              </Link>
              <Link
                to={`/jobs/${_id}`}
                className="block font-bold text-slate-900 group-hover:text-indigo-600 text-base sm:text-lg transition-colors line-clamp-1 mt-0.5"
              >
                {title}
              </Link>
            </div>
          </div>

          {onSaveToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onSaveToggle(_id);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                  : 'border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Badges / Pill Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            <MapPin className="w-3 h-3 text-slate-500" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
            {workMode}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            <Briefcase className="w-3 h-3 text-slate-500" />
            {jobType}
          </span>
          {experienceLevel && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              {experienceLevel}
            </span>
          )}
        </div>

        {/* Skills Tag preview */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-400">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-xs sm:text-sm font-bold text-emerald-700 truncate">
            {formatSalary()}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 inline shrink-0" /> {timeAgo(createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/jobs/${_id}`}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Details
          </Link>
          {onQuickApply ? (
            <button
              onClick={() => onQuickApply(job)}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/15 transition-all"
            >
              Apply Now
            </button>
          ) : (
            <Link
              to={`/jobs/${_id}`}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/15 transition-all"
            >
              Apply
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
