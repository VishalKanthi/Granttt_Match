"""
Eligibility checking engine - rule-based validation
"""
from typing import List, Tuple
from app.models.user import UserProfile
from app.models.grant import Eligibility


def check_eligibility(profile: UserProfile, eligibility: Eligibility) -> Tuple[float, List[str], List[str]]:
    """
    Check if a user profile meets grant eligibility requirements.
    
    Returns:
        Tuple of (score 0-1, list of issues, list of action items)
    """
    score = 1.0
    issues = []
    action_items = []
    
    # Check user type
    if profile.user_type not in eligibility.user_types:
        score -= 0.25
        issues.append(f"User type '{profile.user_type}' not in allowed types: {eligibility.user_types}")
    
    # Check stage
    if profile.stage not in eligibility.stages:
        score -= 0.2
        issues.append(f"Stage '{profile.stage}' not eligible - requires: {eligibility.stages}")
        if "registered" in eligibility.stages and profile.stage in ["idea", "prototype"]:
            action_items.append("Register your company to become eligible")
    
    # Check location
    if "Global" not in eligibility.location:
        if profile.location.country not in eligibility.location:
            score -= 0.3
            issues.append(f"Location '{profile.location.country}' not in eligible regions: {eligibility.location}")
    
    # Check organization type
    if profile.organization.type not in eligibility.organization_types:
        score -= 0.15
        issues.append(f"Organization type '{profile.organization.type}' not eligible")
    
    # Check team size
    if profile.organization.team_size < eligibility.min_team_size:
        score -= 0.1
        issues.append(f"Team size {profile.organization.team_size} is below minimum {eligibility.min_team_size}")
        action_items.append(f"Grow team to at least {eligibility.min_team_size} members")
    
    # Check registration requirement
    if eligibility.requires_registration and not profile.organization.registered:
        score -= 0.2
        issues.append("Grant requires registered entity")
        action_items.append("Complete company/organization registration")
    
    # Determine eligibility status
    return max(0, score), issues, action_items


def get_eligibility_status(score: float, issues: List[str]) -> str:
    """Convert score to status string"""
    if score >= 0.8:
        return "eligible"
    elif score >= 0.5:
        return "needs_action"
    else:
        return "not_eligible"
