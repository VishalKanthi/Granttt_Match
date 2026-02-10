import React from 'react';

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground">Coming soon...</p>
    </div>
);

export default Placeholder;
