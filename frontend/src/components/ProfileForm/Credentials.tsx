import React from 'react';
import type { UserProfile } from '../../types';

interface StepProps {
    data: UserProfile;
    updateData: (updates: Partial<UserProfile>) => void;
}

const Credentials: React.FC<StepProps> = ({ data, updateData }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Publications / Papers</label>
                <input
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={data.credentials.publications}
                    onChange={(e) => updateData({ credentials: { ...data.credentials, publications: parseInt(e.target.value) || 0 } })}
                />
                <p className="text-xs text-slate-500 mt-1">Research papers, white papers, etc.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patents Filed/Granted</label>
                <input
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={data.credentials.patents}
                    onChange={(e) => updateData({ credentials: { ...data.credentials, patents: parseInt(e.target.value) || 0 } })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Previous Grants Won (Optional)</label>
                <textarea
                    rows={3}
                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="List any previous grants (one per line)..."
                    value={data.credentials.previous_grants.join('\n')}
                    onChange={(e) => updateData({ credentials: { ...data.credentials, previous_grants: e.target.value.split('\n').filter(g => g.trim()) } })}
                />
            </div>
        </div>
    );
};

export default Credentials;
