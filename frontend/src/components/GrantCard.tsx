import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MatchResult } from '../types';
import { cn } from '../lib/utils';

interface GrantCardProps {
    match: MatchResult;
}

const GrantCard: React.FC<GrantCardProps> = ({ match }) => {
    const { grant, match_score, eligibility_status, explanation } = match;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'eligible': return 'text-green-600 bg-green-50 border-green-200';
            case 'needs_action': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'not_eligible': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'eligible': return <CheckCircle className="w-4 h-4" />;
            case 'needs_action': return <AlertTriangle className="w-4 h-4" />;
            case 'not_eligible': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const daysUntilDeadline = () => {
        const deadline = new Date(grant.deadline);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            {grant.organization}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                            {grant.name}
                        </h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-sm font-medium text-slate-500">Match Score</div>
                        <div className={cn("text-2xl font-bold",
                            match_score >= 80 ? "text-green-600" :
                                match_score >= 50 ? "text-yellow-600" : "text-slate-400"
                        )}>
                            {match_score}%
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5", getStatusColor(eligibility_status))}>
                            {getStatusIcon(eligibility_status)}
                            {eligibility_status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {daysUntilDeadline()} days left
                        </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
                        <div className="font-medium mb-1 text-slate-900">Why matched:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600">
                            {explanation.why_matched.slice(0, 2).map((reason, idx) => (
                                <li key={idx} className="line-clamp-1">{reason}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                        <div>
                            <span className="text-slate-500">Amount:</span> <span className="font-semibold text-slate-900">${grant.amount.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Difficulty:</span> <span className="font-medium capitalize text-slate-700">{grant.difficulty}</span>
                        </div>
                    </div>
                </div>

                <Link to={`/grants/${grant.id}`} state={{ match }}>
                    <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors">
                        View Details & Apply <ChevronRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>

            {match_score >= 80 && (
                <div className="bg-green-600 h-1.5 w-full" />
            )}
        </motion.div>
    );
};

export default GrantCard;
