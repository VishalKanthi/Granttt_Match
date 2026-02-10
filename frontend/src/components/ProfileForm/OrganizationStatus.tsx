import React from 'react';
import type { UserProfile } from '../../types';

interface StepProps {
    data: UserProfile;
    updateData: (updates: Partial<UserProfile>) => void;
}

const OrganizationStatus: React.FC<StepProps> = ({ data, updateData }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Stage</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { value: 'idea', label: 'Idea / Concept', desc: 'No prototype yet' },
                        { value: 'prototype', label: 'Prototype / MVP', desc: 'Working product' },
                        { value: 'registered', label: 'Registered / Beta', desc: 'Incorporated entity' },
                        { value: 'revenue', label: 'Revenue Generating', desc: 'Paying customers' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => updateData({ stage: option.value })}
                            className={`text-left p-3 border rounded-lg transition-all ${data.stage === option.value
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className={`font-medium text-sm ${data.stage === option.value ? 'text-primary' : 'text-slate-900'}`}>
                                {option.label}
                            </div>
                            <div className="text-xs text-slate-500">{option.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Registration Status</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="registered"
                                className="text-primary focus:ring-primary"
                                checked={data.organization.registered}
                                onChange={() => updateData({ organization: { ...data.organization, registered: true } })}
                            />
                            <span className="text-sm">Registered Entity</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="registered"
                                className="text-primary focus:ring-primary"
                                checked={!data.organization.registered}
                                onChange={() => updateData({ organization: { ...data.organization, registered: false } })}
                            />
                            <span className="text-sm">Not Registered</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Team Size</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={data.organization.team_size}
                        onChange={(e) => updateData({ organization: { ...data.organization, team_size: parseInt(e.target.value) || 1 } })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Founding Date (Optional)</label>
                <input
                    type="month"
                    className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={data.organization.founding_date}
                    onChange={(e) => updateData({ organization: { ...data.organization, founding_date: e.target.value } })}
                />
            </div>
        </div>
    );
};

export default OrganizationStatus;
