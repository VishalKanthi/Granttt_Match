import React from 'react';
import type { UserProfile } from '../../types';

interface StepProps {
    data: UserProfile;
    updateData: (updates: Partial<UserProfile>) => void;
}

const BasicInfo: React.FC<StepProps> = ({ data, updateData }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Startup', 'Researcher', 'Non-Profit', 'Student'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => updateData({ user_type: type.toLowerCase() })}
                                className={`px-4 py-3 border rounded-lg text-sm font-medium transition-all ${data.user_type === type.toLowerCase()
                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Focus Domains</label>
                    <p className="text-xs text-slate-500 mb-2">Select all that apply</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['AI', 'Healthcare', 'FinTech', 'CleanTech', 'EdTech', 'AgriTech', 'SaaS', 'Hardware', 'Biotech'].map((domain) => (
                            <label
                                key={domain}
                                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${data.domains.includes(domain) ? 'bg-primary/5 border-primary' : 'hover:bg-slate-50 border-slate-200'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                    checked={data.domains.includes(domain)}
                                    onChange={(e) => {
                                        const newDomains = e.target.checked
                                            ? [...data.domains, domain]
                                            : data.domains.filter(d => d !== domain);
                                        updateData({ domains: newDomains });
                                    }}
                                />
                                <span className="text-sm text-slate-700">{domain}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                        <select
                            className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={data.location.country}
                            onChange={(e) => updateData({ location: { ...data.location, country: e.target.value } })}
                        >
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Canada">Canada</option>
                            <option value="Global">Other</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">State / Region</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g. Karnataka"
                            value={data.location.state}
                            onChange={(e) => updateData({ location: { ...data.location, state: e.target.value } })}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g. Bangalore"
                            value={data.location.city}
                            onChange={(e) => updateData({ location: { ...data.location, city: e.target.value } })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
