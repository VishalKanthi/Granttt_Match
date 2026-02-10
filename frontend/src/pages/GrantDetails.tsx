import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import type { Grant, MatchResult, ApplicationTips } from '../types';
import { Check, AlertTriangle, Zap, Target } from 'lucide-react';
import { cn } from '../lib/utils';
// import { motion } from 'framer-motion';

const GrantDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [grant, setGrant] = useState<Grant | null>(location.state?.match?.grant || null);
    const [match] = useState<MatchResult | null>(location.state?.match || null);
    const [tips, setTips] = useState<ApplicationTips | null>(null);
    const [loading, setLoading] = useState(!grant);
    const [analyzing, setAnalyzing] = useState(false);
    const profileId = localStorage.getItem('profile_id');

    useEffect(() => {
        if (!grant) {
            // Fetch if not passed via state
            const fetchGrant = async () => {
                try {
                    const res = await axios.get(`${API_BASE_URL}/grants/${id}`);
                    setGrant(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchGrant();
        }
    }, [id, grant]);

    useEffect(() => {
        if (grant && profileId && !tips) {
            const fetchTips = async () => {
                setAnalyzing(true);
                try {
                    const res = await axios.post(`${API_BASE_URL}/grants/${grant.id}/analyze`, null, {
                        params: { profile_id: profileId, grant_id: grant.id }
                    });
                    setTips(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setAnalyzing(false);
                }
            };
            fetchTips();
        }
    }, [grant, profileId, tips]);

    if (loading || !grant) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Grant Details */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-900 mb-4 flex items-center gap-1">
                        ← Back to results
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 uppercase">
                            {grant.type}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            {grant.organization}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">{grant.name}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 border-b border-slate-200 pb-6">
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-xs uppercase tracking-wide">Amount</span>
                            <span className="font-semibold text-lg">${grant.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-px bg-slate-200 h-10" />
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-xs uppercase tracking-wide">Deadline</span>
                            <span className="font-semibold text-lg">{new Date(grant.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="w-px bg-slate-200 h-10" />
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-xs uppercase tracking-wide">Success Rate</span>
                            <span className="font-semibold text-lg">{(grant.success_rate * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none">
                    <h3 className="text-xl font-semibold mb-3">About this Grant</h3>
                    <p className="text-slate-600 leading-relaxed mb-6">{grant.full_description || grant.description}</p>

                    <h3 className="text-xl font-semibold mb-3">Eligibility Criteria</h3>
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 min-w-4"><Check className="w-4 h-4 text-green-600" /></div>
                                <span className="text-sm text-slate-700">
                                    <span className="font-medium">User Type:</span> {grant.eligibility.user_types.join(', ')}
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 min-w-4"><Check className="w-4 h-4 text-green-600" /></div>
                                <span className="text-sm text-slate-700">
                                    <span className="font-medium">Stage:</span> {grant.eligibility.stages.join(', ')}
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 min-w-4"><Check className="w-4 h-4 text-green-600" /></div>
                                <span className="text-sm text-slate-700">
                                    <span className="font-medium">Location:</span> {grant.eligibility.location.join(', ')}
                                </span>
                            </li>
                            {grant.eligibility.technical_requirements.map((req: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 min-w-4"><Target className="w-4 h-4 text-blue-600" /></div>
                                    <span className="text-sm text-slate-700">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Column: AI Assistant */}
            <div className="space-y-6">
                {match && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Match Score</h3>
                            <span className={cn("text-2xl font-bold",
                                match.match_score >= 80 ? "text-green-600" :
                                    match.match_score >= 50 ? "text-yellow-600" : "text-slate-400"
                            )}>{match.match_score}%</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="text-sm font-medium text-slate-700">Why matched:</div>
                            <ul className="space-y-1.5">
                                {match.explanation.why_matched.map((reason, i) => (
                                    <li key={i} className="text-xs text-slate-600 flex gap-2">
                                        <Check className="w-3.5 h-3.5 text-green-500 mt-0.5" /> {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <a href={grant.website} target="_blank" rel="noreferrer" className="block w-full">
                            <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
                                Apply on Official Website
                            </button>
                        </a>
                    </div>
                )}

                {/* AI Tips Panel */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-24 h-24 text-indigo-600" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-indigo-600" />
                            AI Application Assistant
                        </h3>

                        {analyzing ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-indigo-200/50 rounded w-3/4"></div>
                                <div className="h-4 bg-indigo-200/50 rounded w-1/2"></div>
                                <div className="h-20 bg-indigo-200/50 rounded w-full"></div>
                            </div>
                        ) : tips ? (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs uppercase tracking-wide text-indigo-500 font-bold mb-2">Talking Points</h4>
                                    <ul className="space-y-2">
                                        {tips.talking_points.map((pt, i) => (
                                            <li key={i} className="text-sm text-indigo-900 bg-white/60 p-2 rounded border border-indigo-100">
                                                "{pt}"
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs uppercase tracking-wide text-indigo-500 font-bold mb-2">Concerns to Address</h4>
                                    <ul className="space-y-2">
                                        {tips.concerns.map((c, i) => (
                                            <li key={i} className="text-sm text-slate-700 flex gap-2">
                                                <AlertTriangle className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" /> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
                                    <span className="text-xs font-medium text-indigo-600">Competitiveness</span>
                                    <span className="text-sm font-bold text-indigo-900 capitalize">{tips.competitiveness}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-indigo-700">Unable to generate tips. Please complete your profile fully.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrantDetails;
