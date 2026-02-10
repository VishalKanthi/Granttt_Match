import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    labels: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, labels }) => {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="w-full py-4">
            <div className="flex justify-between mb-2">
                {labels.map((label, index) => (
                    <div
                        key={index}
                        className={`text-xs font-medium hidden sm:block ${index <= currentStep ? 'text-primary' : 'text-slate-400'}`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-2 text-right text-xs text-slate-500 font-medium sm:hidden">
                Step {currentStep + 1} of {totalSteps}
            </div>
        </div>
    );
};

export default ProgressBar;
