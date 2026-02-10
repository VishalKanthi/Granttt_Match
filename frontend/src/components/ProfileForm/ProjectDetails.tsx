import React from 'react';
import type { UserProfile } from '../../types';

interface StepProps {
    data: UserProfile;
    updateData: (updates: Partial<UserProfile>) => void;
}

const ProjectDetails: React.FC<StepProps> = ({ data, updateData }) => {
    const [keywordInput, setKeywordInput] = React.useState('');

    const addKeyword = () => {
        if (keywordInput.trim() && !data.project.keywords.includes(keywordInput.trim())) {
            updateData({
                project: {
                    ...data.project,
                    keywords: [...data.project.keywords, keywordInput.trim()]
                }
            });
            setKeywordInput('');
        }
    };

    const removeKeyword = (kw: string) => {
        updateData({
            project: {
                ...data.project,
                keywords: data.project.keywords.filter(k => k !== kw)
            }
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                <input
                    type="text"
                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. AI-Powered Early Cancer Detection"
                    value={data.project.title}
                    onChange={(e) => updateData({ project: { ...data.project, title: e.target.value } })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                    <span className="text-slate-400 font-normal ml-2">({data.project.description.length} chars)</span>
                </label>
                <textarea
                    rows={4}
                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe your innovation, problem solved, and technology used..."
                    value={data.project.description}
                    onChange={(e) => updateData({ project: { ...data.project, description: e.target.value } })}
                />
                <p className="text-xs text-slate-500 mt-1">Aim for 200+ characters for better AI matching.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Funding Needed (USD)</label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">$</span>
                    <input
                        type="number"
                        className="w-full rounded-md border border-slate-300 py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="50000"
                        value={data.project.funding_needed || ''}
                        onChange={(e) => updateData({ project: { ...data.project, funding_needed: parseInt(e.target.value) || 0 } })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        className="flex-1 rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Add keywords (e.g. deep learning)"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <button
                        type="button"
                        onClick={addKeyword}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.project.keywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                            {kw}
                            <button onClick={() => removeKeyword(kw)} className="hover:text-primary/70">×</button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
