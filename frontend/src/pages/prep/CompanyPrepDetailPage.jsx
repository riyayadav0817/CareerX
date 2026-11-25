import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  HelpCircle,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  BookOpen
} from 'lucide-react';

export default function CompanyPrepDetailPage() {
  const { slug } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('process'); // 'process' | 'pattern' | 'technical' | 'hr'

  useEffect(() => {
    const fetchTrack = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/prep/companies/${slug}`);
        if (res.data.success) {
          setTrack(res.data.track);
        }
      } catch (err) {
        console.error('Error fetching track:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading company preparation track...</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Track Not Found</h2>
        <Link to="/company-prep" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
          Return to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/company-prep" className="hover:text-indigo-600">Company Prep</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{track.companyName}</span>
        </nav>

        {/* Company Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {track.logo ? (
              <img
                src={track.logo}
                alt={track.companyName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain p-2 border border-slate-100 bg-slate-50 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-2xl shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
                Official Hiring Track Blueprint
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {track.companyName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{track.tagline}</p>
            </div>
          </div>

          <Link
            to="/mock-tests"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
          >
            Practice {track.companyName.split(' ')[0]} Mock Exam
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Independent practice & interview guide curated for student career preparation.</span>
        </div>

        {/* Overview Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base">Company Overview & Recruitment Culture</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {track.overview}
          </p>
        </div>

        {/* Tabs: Process, Exam Pattern, Technical Questions, HR Questions */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { id: 'process', label: 'Selection Process' },
            { id: 'pattern', label: 'Exam Pattern & Syllabus' },
            { id: 'technical', label: `Technical Questions (${track.technicalInterviewQuestions?.length || 0})` },
            { id: 'hr', label: `HR Interview (${track.hrInterviewQuestions?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SELECTION PROCESS TIMELINE */}
        {activeTab === 'process' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg">Step-by-Step Hiring Rounds</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-indigo-100">
              {track.selectionProcess?.map((step) => (
                <div key={step.roundNumber} className="relative flex items-start gap-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-500/20 shrink-0 z-10">
                    {step.roundNumber}
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                      {step.duration && (
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {step.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EXAM PATTERN & SYLLABUS */}
        {activeTab === 'pattern' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-lg">Section-Wise Exam Pattern</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Section Name</th>
                      <th className="px-4 py-3">Questions</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Marks</th>
                      <th className="px-4 py-3">Negative Marking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {track.examPattern?.map((pat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3.5 font-bold text-slate-900">{pat.section}</td>
                        <td className="px-4 py-3.5 text-slate-700">{pat.questionCount} Qs</td>
                        <td className="px-4 py-3.5 text-slate-700">{pat.durationMinutes} mins</td>
                        <td className="px-4 py-3.5 font-bold text-indigo-600">{pat.marks}</td>
                        <td className="px-4 py-3.5 text-slate-500">{pat.negativeMarking}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Syllabus */}
            {track.syllabus && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-lg">Detailed Syllabus Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {track.syllabus.map((syl, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-700">
                        {syl.category}
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {syl.topics.map((top, tIdx) => (
                          <li key={tIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span>{top}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TECHNICAL INTERVIEW QUESTIONS */}
        {activeTab === 'technical' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Frequently Asked Technical Interview Questions
            </h3>
            <div className="space-y-4">
              {track.technicalInterviewQuestions?.map((tq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {tq.topic || 'Core CS'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{tq.difficulty}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Q: {tq.question}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/60 font-sans">
                    <strong>Solution: </strong> {tq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HR INTERVIEW QUESTIONS */}
        {activeTab === 'hr' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Behavioral & HR Interview Questions
            </h3>
            <div className="space-y-4">
              {track.hrInterviewQuestions?.map((hr, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Q: {hr.question}</h4>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                    <strong className="block text-slate-900 mb-1">Recommended Response:</strong>
                    {hr.sampleAnswer}
                  </div>
                  {hr.tips && (
                    <p className="text-[11px] text-indigo-700 italic">
                      💡 Tip: {hr.tips}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
