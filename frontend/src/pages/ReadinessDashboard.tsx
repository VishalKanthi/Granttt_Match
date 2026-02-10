import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import type { ReadinessScore } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertTriangle, ArrowRight, Award, Building, User, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const ReadinessDashboard = () => {
    const [scoreData, setScoreData] = useState<ReadinessScore | null>(null);
    const [loading, setLoading] = useState(true);
    const profileId = localStorage.getItem('profile_id');
    const navigate = useNavigate();

    useEffect(() => {
        if (!profileId) {
            navigate('/profile');
            return;
        }

        const fetchScore = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/readiness-score`, {
                    params: { profile_id: profileId }
                });
                setScoreData(response.data);
            } catch (error) {
                console.error('Error fetching score:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScore();
    }, [profileId, navigate]);

    if (loading) {
        return <div className="p-10 text-center">Analysing profile...</div>;
    }

    if (!scoreData) return null;

    const score = scoreData.overall_score;
    const chartData = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score }
    ];
    const COLORS = ['#4f46e5', '#e2e8f0'];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Grant Readiness</h1>
                <button onClick={() => navigate('/results')} className="text-primary font-medium flex items-center gap-1 hover:underline">
                    View Matches <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center"
                >
                    <div className="w-48 h-48 relative mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-slate-900">{score}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Score</span>
                        </div>
                    </div>
                    <h2 className="font-semibold text-lg mb-1">Grant Ready</h2>
                    <p className="text-sm text-slate-500">
                        {score >= 80 ? 'Excellent! You are highly competitive.' :
                            score >= 50 ? 'Good start. Add more details to boost chances.' :
                                'Needs improvement. Complete missing profile sections.'}
                    </p>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                    <h3 className="font-bold text-lg mb-6">Category Breakdown</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Basic Info', key: 'basic_info', max: 20, icon: <User className="w-5 h-5 text-blue-500" /> },
                            { label: 'Project Details', key: 'project_details', max: 30, icon: <Target className="w-5 h-5 text-purple-500" /> },
                            { label: 'Organization', key: 'organization', max: 25, icon: <Building className="w-5 h-5 text-orange-500" /> },
                            { label: 'Credentials', key: 'credentials', max: 25, icon: <Award className="w-5 h-5 text-green-500" /> },
                        ].map((cat, i) => {
                            const val = scoreData.category_scores[cat.key] || 0;
                            const pct = (val / cat.max) * 100;
                            return (
                                <div key={cat.key}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg">{cat.icon}</div>
                                            <span className="font-medium text-slate-700">{cat.label}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">{val}/{cat.max}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                            className={cn("h-full rounded-full transition-all",
                                                pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-slate-300"
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Strong Areas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-green-50/50 rounded-xl border border-green-100 p-6"
                >
                    <h3 className="font-bold text-green-900 flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Strong Areas
                    </h3>
                    <ul className="space-y-3">
                        {scoreData.strong_areas.length > 0 ? (
                            scoreData.strong_areas.map((area: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-green-800 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                    {area}
                                </li>
                            ))
                        ) : (
                            <li className="text-green-800 text-sm italic">Complete more sections to see your strengths!</li>
                        )}
                    </ul>
                </motion.div>

                {/* Improvements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-orange-50/50 rounded-xl border border-orange-100 p-6"
                >
                    <h3 className="font-bold text-orange-900 flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Improvement Areas
                    </h3>
                    <ul className="space-y-3">
                        {scoreData.improvements.map((imp: any, i: number) => (
                            <li key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-semibold text-orange-800">{imp.area}</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">+{imp.points_gain} pts</span>
                                </div>
                                <p className="text-sm text-orange-700/80">{imp.action}</p>
                            </li>
                        ))}
                        {scoreData.improvements.length === 0 && (
                            <li className="text-orange-800 text-sm italic">Great job! No major improvements identified.</li>
                        )}
                    </ul>

                    <button
                        onClick={() => navigate('/profile')}
                        className="mt-4 w-full py-2 bg-white border border-orange-200 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
                    >
                        Update Profile
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ReadinessDashboard;
