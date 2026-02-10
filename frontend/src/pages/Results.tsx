import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import type { MatchResult } from '../types';
import GrantCard from '../components/GrantCard';
// import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Results = () => {
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const profileId = localStorage.getItem('profile_id');
    const navigate = useNavigate();

    useEffect(() => {
        if (!profileId) {
            navigate('/profile');
            return;
        }

        const fetchMatches = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/match`, {
                    profile_id: profileId,
                    // Send profile data as backup if ID not found (in-memory DB reset)
                    ...(!profileId && userProfile)
                }, {
                    params: { profile_id: profileId }
                });
                setMatches(response.data.matches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [profileId, navigate]);

    const filteredMatches = matches.filter(match => {
        if (filter === 'all') return true;
        if (filter === 'eligible') return match.eligibility_status === 'eligible';
        if (filter === 'high_score') return match.match_score >= 80;
        return true;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-semibold">AI is analyzing 500+ grants...</h2>
                <p className="text-slate-500">Matching your profile against eligibility criteria</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Grant Matches</h1>
                    <p className="text-slate-500">
                        We found <span className="font-semibold text-primary">{matches.length} grants</span> matching your profile.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        All Matches
                    </button>
                    <button
                        onClick={() => setFilter('eligible')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'eligible' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Eligible Only
                    </button>
                    <button
                        onClick={() => setFilter('high_score')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'high_score' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Top Matches (&gt;80%)
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {filteredMatches.map((match) => (
                    <GrantCard key={match.grant.id} match={match} />
                ))}
            </div>

            {filteredMatches.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed">
                    <p className="text-slate-500">No matches found for this filter.</p>
                    <button onClick={() => setFilter('all')} className="text-primary font-medium hover:underline mt-2">
                        View all matches
                    </button>
                </div>
            )}
        </div>
    );
};

export default Results;
