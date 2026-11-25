import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import {
  Code2,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Terminal,
  RotateCcw,
  Building2,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function CodingDsaPage() {
  const { id } = useParams();

  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Editor State
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [outputResult, setOutputResult] = useState(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcases'); // 'testcases' | 'result'
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await api.get('/prep/coding/problems');
        if (res.data.success) {
          const list = res.data.problems || [];
          setProblems(list);

          // If id param is passed, find that problem; otherwise pick first
          if (id) {
            const found = list.find((p) => p._id === id || p.slug === id);
            if (found) setSelectedProblem(found);
            else if (list.length > 0) setSelectedProblem(list[0]);
          } else if (list.length > 0) {
            setSelectedProblem(list[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching coding problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [id]);

  // When selected problem or language changes, update starter code
  useEffect(() => {
    if (selectedProblem) {
      const template = selectedProblem.starterTemplates?.[language] || '// Write your solution here\n';
      setCode(template);
      setOutputResult(null);
      setShowHint(false);
    }
  }, [selectedProblem, language]);

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    setRunning(true);
    setActiveConsoleTab('result');
    try {
      const res = await api.post(`/prep/coding/${selectedProblem._id}/run`, {
        language,
        code,
      });
      if (res.data.success) {
        setOutputResult(res.data.result);
      }
    } catch (err) {
      setOutputResult({
        status: 'Runtime Error',
        errorMessage: err.response?.data?.message || 'Execution failed',
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedProblem) return;
    setSubmitting(true);
    setActiveConsoleTab('result');
    try {
      const res = await api.post(`/prep/coding/${selectedProblem._id}/submit`, {
        language,
        code,
      });
      if (res.data.success) {
        setOutputResult(res.data.result);
        if (res.data.result.status === 'Accepted') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      setOutputResult({
        status: 'Runtime Error',
        errorMessage: err.response?.data?.message || 'Submission failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetTemplate = () => {
    if (selectedProblem) {
      setCode(selectedProblem.starterTemplates?.[language] || '');
      setOutputResult(null);
    }
  };

  const filteredProblems = problems.filter((p) => {
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/placement-prep" className="hover:text-indigo-600">Placement Prep</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Coding & DSA Practice</span>
          </nav>

          {/* Quick Problem Selector Dropdown on mobile / Header */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-semibold">Select Challenge:</span>
            <select
              value={selectedProblem?._id || ''}
              onChange={(e) => {
                const found = problems.find((p) => p._id === e.target.value);
                if (found) setSelectedProblem(found);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none"
            >
              {problems.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Panel IDE Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: Problem Details & Constraints (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5 max-h-[82vh] overflow-y-auto">
              {/* Header Title & Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      selectedProblem?.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700'
                        : selectedProblem?.difficulty === 'Hard'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {selectedProblem?.difficulty}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {selectedProblem?.category}
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900">
                  {selectedProblem?.title}
                </h1>
              </div>

              {/* Company Tags */}
              {selectedProblem?.companyTags && selectedProblem.companyTags.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Frequently asked at: <strong>{selectedProblem.companyTags.join(', ')}</strong></span>
                </div>
              )}

              {/* Problem Description */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                <p>{selectedProblem?.description}</p>
              </div>

              {/* Constraints */}
              {selectedProblem?.constraints && selectedProblem.constraints.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Constraints:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 font-mono">
                    {selectedProblem.constraints.map((c, cIdx) => (
                      <li key={cIdx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Test Cases */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Example Test Cases:</h4>
                {selectedProblem?.sampleTestCases?.map((tc, tcIdx) => (
                  <div key={tcIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs space-y-1">
                    <p><span className="text-slate-400 select-none">Input: </span><span className="text-slate-800 font-semibold">{tc.input}</span></p>
                    <p><span className="text-slate-400 select-none">Output: </span><span className="text-indigo-600 font-semibold">{tc.output}</span></p>
                    {tc.explanation && (
                      <p className="text-[11px] text-slate-500 font-sans italic pt-1">
                        Explanation: {tc.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Hints Drawer */}
              {selectedProblem?.hints && selectedProblem.hints.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'View Algorithmic Hint'}</span>
                  </button>
                  {showHint && (
                    <div className="mt-2 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 leading-relaxed animate-fade-in">
                      {selectedProblem.hints[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Code Editor & Console Output (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
              {/* Editor Top Bar: Language + Reset */}
              <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Language:</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="python">Python 3</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <button
                  onClick={handleResetTemplate}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                  title="Reset code template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Template</span>
                </button>
              </div>

              {/* Code Textarea / IDE */}
              <div className="relative font-mono text-xs sm:text-sm">
                <textarea
                  rows={16}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-900 text-indigo-200 p-5 font-mono text-xs sm:text-sm leading-relaxed outline-none resize-none border-none focus:ring-0 selection:bg-indigo-700"
                  spellCheck="false"
                ></textarea>
              </div>

              {/* Action Toolbar */}
              <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Terminal className="w-4 h-4 text-slate-500" />
                  <span>Sandboxed Execution Engine</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunCode}
                    disabled={running || submitting}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-200" />
                    <span>{running ? 'Running...' : 'Run Test Cases'}</span>
                  </button>

                  <button
                    onClick={handleSubmitCode}
                    disabled={running || submitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Evaluating...' : 'Submit Solution'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Console / Execution Result Drawer */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <button
                    onClick={() => setActiveConsoleTab('testcases')}
                    className={`pb-1 ${
                      activeConsoleTab === 'testcases'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Sample Cases
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('result')}
                    className={`pb-1 ${
                      activeConsoleTab === 'result'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Execution Result
                  </button>
                </div>

                {outputResult && (
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      outputResult.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {outputResult.status}
                  </span>
                )}
              </div>

              {activeConsoleTab === 'testcases' && (
                <div className="space-y-2 font-mono text-xs">
                  {selectedProblem?.sampleTestCases?.map((tc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                      <p><span className="text-slate-400">Input:</span> {tc.input}</p>
                      <p><span className="text-slate-400">Expected:</span> <span className="text-emerald-700 font-semibold">{tc.output}</span></p>
                    </div>
                  ))}
                </div>
              )}

              {activeConsoleTab === 'result' && (
                <div>
                  {!outputResult ? (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      Click "Run Test Cases" or "Submit Solution" to inspect compiler feedback.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <span>Passed: <strong>{outputResult.passedTestCases} / {outputResult.totalTestCases}</strong></span>
                        <span>Runtime: <strong>{outputResult.executionTimeMs} ms</strong></span>
                      </div>

                      {outputResult.errorMessage && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono">
                          {outputResult.errorMessage}
                        </div>
                      )}

                      {outputResult.testOutputs?.map((t, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                            t.passed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-sans">
                            <span className="font-bold text-slate-700">Test Case #{idx + 1}</span>
                            <span className={t.passed ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                              {t.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                          <p><span className="text-slate-400">Input:</span> {t.input}</p>
                          <p><span className="text-slate-400">Expected:</span> {t.expectedOutput}</p>
                          <p><span className="text-slate-400">Actual:</span> <span className={t.passed ? 'text-emerald-700' : 'text-rose-700'}>{t.actualOutput}</span></p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
