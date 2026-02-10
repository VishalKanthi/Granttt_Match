import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import type { UserProfile } from '../types';
import ProgressBar from '../components/ProfileForm/ProgressBar';
import BasicInfo from '../components/ProfileForm/BasicInfo';
import ProjectDetails from '../components/ProfileForm/ProjectDetails';
import OrganizationStatus from '../components/ProfileForm/OrganizationStatus';
import Credentials from '../components/ProfileForm/Credentials';

const initialProfile: UserProfile = {
    user_type: 'startup',
    domains: [],
    location: { country: 'India', state: '', city: '' },
    stage: 'idea',
    organization: { type: 'company', registered: false, team_size: 1, founding_date: '' },
    project: { title: '', description: '', keywords: [], funding_needed: 0, timeline: '12 months' },
    credentials: { previous_grants: [], publications: 0, patents: 0 }
};

const steps = [
    { label: 'Basic Info', component: BasicInfo },
    { label: 'Project Details', component: ProjectDetails },
    { label: 'Organization', component: OrganizationStatus },
    { label: 'Credentials', component: Credentials }
];

const ProfileBuilder = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    const [loading, setLoading] = useState(false);

    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/profile/create`, profile);
            // Store profile ID in localStorage for persistence
            localStorage.setItem('profile_id', response.data.profile_id);
            localStorage.setItem('user_profile', JSON.stringify(profile));
            navigate('/results');
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Failed to create profile. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Build Your Grant Profile</h1>
                <p className="text-slate-500">
                    Complete these 4 steps to let our AI find the perfect funding opportunities for you.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <ProgressBar
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        labels={steps.map(s => s.label)}
                    />
                </div>

                <div className="p-6 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CurrentStepComponent data={profile} updateData={updateProfile} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-70"
                    >
                        {loading ? (
                            'Saving...'
                        ) : currentStep === steps.length - 1 ? (
                            <>Find Matches <Save className="w-4 h-4" /></>
                        ) : (
                            <>Next Step <ChevronRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileBuilder;
