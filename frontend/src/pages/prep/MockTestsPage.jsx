import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Clock,
  Award,
  AlertCircle,
  Play,
  CheckCircle2,
  Filter,
  Sparkles,
  BookOpen,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

export default function MockTestsPage() {
  const [tests, setTests] = useState([]);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMockTests = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'all') queryParams.append('category', category);
        if (difficulty !== 'all') queryParams.append('difficulty', difficulty);

        const res = await api.get(`/prep/mock-tests?${queryParams.toString()}`);
        if (res.data.success) {
          setTests(res.data.tests || []);
        }
      } catch (err) {
        console.error('Error fetching mock tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMockTests();
  }, [category, difficulty]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="surface-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-full bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none"></div>
          <div className="max-w-2xl space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full Placement Simulation &amp; Examination Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Placement Mock Tests &amp; Assessments
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Experience authentic test environments with timed countdowns, negative marking rules, question review palettes, and instant scorecard analytics.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="surface-card p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Tests' },
              { id: 'full-assessment', label: 'Full Placement Simulator' },
              { id: 'company-special', label: 'Company Special' },
              { id: 'aptitude', label: 'Aptitude' },
              { id: 'reasoning', label: 'Reasoning' },
              { id: 'core-cs', label: 'Core Technical' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCategory(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  category === f.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 font-semibold">Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Mock Tests Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-slate-500">Loading mock tests...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-3">
            <Clock className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No mock tests found</h3>
            <p className="text-xs text-slate-500">Try changing your category or difficulty filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                      {test.companyTag || 'Placement Drill'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {test.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">DURATION</span>
                      <strong className="text-slate-800">{test.durationMinutes} mins</strong>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">TOTAL MARKS</span>
                      <strong className="text-indigo-600">{test.totalMarks}</strong>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">NEGATIVE MARK</span>
                      <strong className="text-rose-600">
                        {test.negativeMarking > 0 ? `-${test.negativeMarking}` : 'None'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {test.attemptsCount || 100}+ test takers
                  </span>

                  <Link
                    to={`/mock-tests/${test._id}`}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Test</span>
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
