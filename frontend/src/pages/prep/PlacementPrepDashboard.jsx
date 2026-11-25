import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Flame,
  Award,
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Code2,
  HelpCircle,
  FileText,
  Layers,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Zap,
  BarChart2,
  Play
} from 'lucide-react';

export default function PlacementPrepDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/prep/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching prep dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const prepCategories = [
    {
      id: 'aptitude',
      title: 'Quantitative Aptitude',
      desc: '12 core topics: Percentages, Profit & Loss, Work, Speed, Probability, Permutations...',
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      link: '/placement-prep/aptitude',
      statsKey: 'aptitude',
      color: 'from-indigo-50 to-blue-50 border-indigo-100',
      badge: '12 Topics',
    },
    {
      id: 'reasoning',
      title: 'Logical Reasoning',
      desc: '10 topics: Blood Relations, Direction, Syllogisms, Seating, Coding-Decoding...',
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      link: '/placement-prep/reasoning',
      statsKey: 'reasoning',
      color: 'from-purple-50 to-fuchsia-50 border-purple-100',
      badge: '10 Topics',
    },
    {
      id: 'verbal',
      title: 'Verbal Ability',
      desc: '8 topics: Reading Comprehension, Grammar, Sentence Correction, Para Jumbles...',
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      link: '/placement-prep/verbal',
      statsKey: 'verbal',
      color: 'from-emerald-50 to-teal-50 border-emerald-100',
      badge: '8 Topics',
    },
    {
      id: 'coding',
      title: 'Coding & DSA Practice',
      desc: '10 DSA modules: Arrays, Linked Lists, Trees, Dynamic Programming, Graphs...',
      icon: <Code2 className="w-6 h-6 text-amber-600" />,
      link: '/placement-prep/coding',
      statsKey: 'coding',
      color: 'from-amber-50 to-orange-50 border-amber-100',
      badge: 'Interactive IDE',
    },
    {
      id: 'core-cs',
      title: 'Core Computer Science',
      desc: '6 subjects: DBMS & SQL, Operating Systems, Computer Networks, OOP, Software Eng...',
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      link: '/placement-prep/core-cs',
      statsKey: 'coreCs',
      color: 'from-blue-50 to-cyan-50 border-blue-100',
      badge: '6 Subjects',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Hero Banner */}
        <div className="surface-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-50/80 via-purple-50/30 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>All-in-One Campus Recruitment &amp; Placement Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Placement Preparation Masterclass
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Master Quantitative Aptitude, Logical Reasoning, Verbal Ability, Coding DSA, and Core CS. Simulate actual exam patterns for TCS, Infosys, Amazon, Google, and more.
              </p>
            </div>

            {/* Streak & Key Metric Badges */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Daily Streak
                  </span>
                  <p className="text-lg font-extrabold text-slate-900">{stats?.streakDays ?? 0} Days</p>
                </div>
              </div>

              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Overall Accuracy
                  </span>
                  <p className="text-lg font-extrabold text-indigo-600">{stats?.accuracyPercentage ?? 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Solved Questions</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats?.completedQuestionsCount ?? 0}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              {stats?.isGuest ? 'Sign in to save progress' : 'Saved to your profile'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Correct Answers</span>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
              {stats?.correctQuestionsCount ?? 0}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {stats?.accuracyPercentage ?? 0}% accuracy rate
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Mock Tests Taken</span>
            <p className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">
              {stats?.recentTests?.length ?? 0}
            </p>
            <Link to="/mock-tests" className="text-[11px] text-purple-700 font-semibold mt-1 block hover:underline">
              Take a new test →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Coding Problems Solved</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {stats?.categoryStats?.coding?.solved ?? 0}
            </p>
            <Link to="/placement-prep/coding" className="text-[11px] text-amber-700 font-semibold mt-1 block hover:underline">
              Launch code editor →
            </Link>
          </div>
        </div>

        {/* Practice Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Preparation Subjects & Practice Tracks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Practice topic-wise MCQs with detailed formula derivations, step-by-step solutions, and difficulty filters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prepCategories.map((cat) => {
              const catStat = stats?.categoryStats ? stats.categoryStats[cat.statsKey] : null;
              const attempted = catStat?.attempted || 0;
              const correct = catStat?.correct || catStat?.solved || 0;

              return (
                <div
                  key={cat.id}
                  className={`bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm hover:shadow-lg transition-all flex flex-col justify-between group`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        {cat.icon}
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Progress mini bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Mastery Progress</span>
                        <span>{attempted > 0 ? `${correct} of ${attempted} correct` : 'Ready to start'}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                          style={{ width: `${attempted > 0 ? Math.min(100, Math.round((correct / attempted) * 100)) : 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <Link
                      to={cat.link}
                      className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
                    >
                      <span>Practice {cat.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Quick Mock Test Callout Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-lg">Full Mock Test Simulator</h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Experience a timed exam environment with question palette, negative marking, auto-submission, and instant scorecard analytics.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  to="/mock-tests"
                  className="w-full py-2.5 rounded-2xl bg-white text-indigo-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-900" />
                  <span>Launch Mock Tests</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Daily Challenge & Recommended Topics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Challenge Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Daily Practice Target</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {stats?.dailyChallenge?.completedQuestions ?? 0} / {stats?.dailyChallenge?.targetQuestions ?? 5} done
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Solve 5 questions daily to keep your placement preparation streak alive and build interview problem-solving stamina.
            </p>

            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      ((stats?.dailyChallenge?.completedQuestions ?? 0) /
                        (stats?.dailyChallenge?.targetQuestions || 5)) *
                        100
                    )
                  )}%`,
                }}
              ></div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <p className="text-xs font-bold text-amber-950">Next Target Question:</p>
              <p className="text-xs text-amber-800 line-clamp-2">
                {stats?.dailyQuestion?.question || 'Practice Quantitative Aptitude questions to hit your daily target.'}
              </p>
              <Link
                to="/placement-prep/aptitude"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:underline pt-1"
              >
                <span>Solve & Finish Daily Goal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recommended Practice Topics */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recommended Focus Topics</h3>
                <p className="text-xs text-slate-500">Based on high-frequency questions in recent campus hiring drives</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.recommendedTopics?.map((rec, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rec.name}</h4>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                      {rec.category} • {rec.questionsCount} questions available
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {rec.difficulty}
                    </span>
                    <Link
                      to={`/placement-prep/${rec.category}`}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"
                    >
                      Practice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Preparation Tracks Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                Company Specific Prep
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Top Recruiter Selection Process & Exam Patterns
              </h2>
            </div>
            <Link
              to="/company-prep"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View all 9 company guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'TCS', slug: 'tcs', role: 'Ninja & Digital', exam: 'NQT Pattern' },
              { name: 'Infosys', slug: 'infosys', role: 'SE & DSE', exam: 'InfyTQ Exam' },
              { name: 'Amazon', slug: 'amazon', role: 'SDE-1', exam: 'OA & 16 LPs' },
              { name: 'Google', slug: 'google', role: 'Software Eng', exam: 'Algorithmic GOC' },
              { name: 'Microsoft', slug: 'microsoft', role: 'SWE', exam: 'Codility Drive' },
              { name: 'Accenture', slug: 'accenture', role: 'ASE & AASE', exam: 'Cognitive Test' },
            ].map((comp, idx) => (
              <Link
                key={idx}
                to={`/company-prep/${comp.slug}`}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition-all text-center group"
              >
                <h4 className="font-extrabold text-slate-900 group-hover:text-indigo-600 text-base">
                  {comp.name}
                </h4>
                <p className="text-[11px] font-semibold text-indigo-600 mt-1">{comp.role}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{comp.exam}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Placement Goals Tracker */}
        {stats?.upcomingGoals && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Upcoming Placement Preparation Milestones</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.upcomingGoals.map((goal, gIdx) => (
                <div
                  key={gIdx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{goal.title}</h5>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Target:{' '}
                      {goal.targetDate
                        ? new Date(goal.targetDate).toLocaleDateString()
                        : 'Next Week'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
