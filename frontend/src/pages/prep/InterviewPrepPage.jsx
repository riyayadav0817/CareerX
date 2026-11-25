import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle2,
  Code2,
  BookOpen,
  Award,
  Layers,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  Check
} from 'lucide-react';

export default function InterviewPrepPage() {
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('star'); // 'star' | 'hr' | 'technical' | 'resume' | 'project'

  useEffect(() => {
    const fetchInterviewData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/prep/interview-prep');
        if (res.data.success) {
          setPrepData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching interview prep:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading interview masterclass guides...</p>
      </div>
    );
  }

  const { starMethod, resumeGuide, projectGuide, hrQuestions, technicalDomains } = prepData || {};

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="surface-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-full bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none"></div>
          <div className="max-w-2xl space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus &amp; Corporate Placement Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interview Preparation Playbook
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Master behavioral interviews using the STAR method, polish your resume for ATS screening, and articulate capstone projects with confidence.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1.5">
          {[
            { id: 'star', label: 'STAR Behavioral Method' },
            { id: 'hr', label: 'HR Interview Questions' },
            { id: 'technical', label: 'Technical Domains Q&A' },
            { id: 'resume', label: 'ATS Resume Guide' },
            { id: 'project', label: 'Project Explanation Guide' },
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

        {/* TAB 1: STAR BEHAVIORAL METHOD */}
        {activeTab === 'star' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {starMethod?.title || 'The STAR Behavioral Interview Method'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {starMethod?.description ||
                  'The gold standard technique utilized by Amazon, Google, Microsoft, and leading consulting firms to evaluate past behavioral indicators.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {starMethod?.steps?.map((step) => (
                  <div
                    key={step.letter}
                    className="p-5 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-2 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center">
                      {step.letter}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base">{step.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Example */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">STAR Real-World Example</h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                <p><strong>Question:</strong> "Describe a critical production bug you fixed under pressure."</p>
                <p><strong>[S] Situation:</strong> 2 days before our annual tech symposium, our registration API crashed under a spike of 1,200 concurrent requests.</p>
                <p><strong>[T] Task:</strong> As the backend lead, I had to identify the bottleneck and restore system responsiveness within 3 hours.</p>
                <p><strong>[A] Action:</strong> I inspected the query logs, identified unindexed table scans on the users collection, implemented Redis caching for auth sessions, and added compound indexes.</p>
                <p><strong>[R] Result:</strong> Response times dropped from 4.2 seconds to 85 milliseconds, and our application smoothly handled over 5,000 successful registrations.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HR INTERVIEW QUESTIONS */}
        {activeTab === 'hr' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              High-Frequency HR & Cultural Fit Questions
            </h2>
            <div className="space-y-5">
              {hrQuestions?.map((hr, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Q: {hr.q}</h3>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="block text-slate-900 mb-1">High-Impact Sample Answer:</strong>
                    {hr.sampleAnswer}
                  </div>
                  {hr.tips && (
                    <div className="flex items-center gap-2 text-xs text-indigo-700 font-medium">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <span>{hr.tips}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TECHNICAL INTERVIEW DOMAINS */}
        {activeTab === 'technical' && (
          <div className="space-y-6">
            {technicalDomains?.map((domain, dIdx) => (
              <div key={dIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-600" />
                  <span>{domain.domain}</span>
                </h3>

                <div className="space-y-4 divide-y divide-slate-100">
                  {domain.questions.map((q, qIdx) => (
                    <div key={qIdx} className="pt-4 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm">Q: {q.q}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                        <strong>Answer: </strong> {q.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ATS RESUME GUIDE */}
        {activeTab === 'resume' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {resumeGuide?.title || 'Resume Preparation Guide & ATS Checklist'}
            </h2>
            <div className="space-y-3">
              {resumeGuide?.tips?.map((tip, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs text-indigo-950">
              <h4 className="font-bold text-indigo-900 text-sm">Google's XYZ Formula for Impact:</h4>
              <p className="leading-relaxed">
                "Accomplished [X] as measured by [Y], by doing [Z]"
                <br />
                <em>Example:</em> "Optimized API throughput by 45% (Y) by redesigning PostgreSQL indexes and adding Redis caching (Z) across 15 microservices (X)."
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: PROJECT EXPLANATION GUIDE */}
        {activeTab === 'project' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {projectGuide?.title || 'How to Explain Your Capstone & Personal Projects'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Recruiters listen to hundreds of project pitches. Structure your 2-minute pitch to highlight architecture, tradeoffs, and ownership.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectGuide?.structure?.map((st, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase">Phase {idx + 1}</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">{st}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
