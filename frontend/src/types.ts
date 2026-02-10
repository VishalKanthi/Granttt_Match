export interface Location {
    country: string;
    state: string;
    city: string;
}

export interface Organization {
    type: string;
    registered: boolean;
    team_size: number;
    founding_date: string;
}

export interface Project {
    title: string;
    description: string;
    keywords: string[];
    funding_needed: number;
    timeline: string;
}

export interface Credentials {
    previous_grants: string[];
    publications: number;
    patents: number;
}

export interface UserProfile {
    id?: string;
    user_type: string;
    domains: string[];
    location: Location;
    stage: string;
    organization: Organization;
    project: Project;
    credentials: Credentials;
}

export interface Grant {
    id: string;
    name: string;
    organization: string;
    type: string;
    amount: number;
    currency: string;
    deadline: string;
    description: string;
    full_description?: string;
    focus_areas: string[];
    eligibility: any;
    benefits: string[];
    match_score?: number;
    difficulty: string;
    application_time_estimate: string;
    success_rate: number;
    website: string;
}

export interface MatchResult {
    grant: Grant;
    match_score: number;
    eligibility_status: 'eligible' | 'needs_action' | 'not_eligible';
    eligibility_issues: string[];
    explanation: {
        why_matched: string[];
        action_items: string[];
    };
}

export interface ApplicationTips {
    key_strengths: string[];
    talking_points: string[];
    concerns: string[];
    competitiveness: string;
    estimated_success_rate: number;
}

export interface ReadinessScore {
    profile_id: string;
    overall_score: number;
    category_scores: { [key: string]: number };
    strong_areas: string[];
    improvements: {
        area: string;
        action: string;
        points_gain: number;
    }[];
}
