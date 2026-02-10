"""
Generate human-readable explanations for grant matches
"""
from typing import List, Dict
from app.models.user import UserProfile
from app.models.grant import Grant


def generate_explanation(
    profile: UserProfile,
    grant: Grant,
    semantic_score: float,
    domain_score: float,
    eligibility_score: float,
    eligibility_issues: List[str],
    action_items: List[str]
) -> Dict:
    """
    Generate explanation for why a grant matches the user profile
    """
    why_matched = []
    
    # Semantic match reasons
    if semantic_score > 0.7:
        why_matched.append(f"Your project description strongly aligns with this grant's focus on {', '.join(grant.focus_areas[:2])}")
    elif semantic_score > 0.4:
        why_matched.append(f"Your project has good alignment with {grant.name}'s objectives")
    
    # Domain match reasons
    user_domains = set(d.lower() for d in profile.domains)
    grant_areas = set(a.lower() for a in grant.focus_areas)
    overlap = user_domains & grant_areas
    
    if domain_score >= 1.0:
        why_matched.append(f"Perfect domain match: {', '.join(profile.domains)}")
    elif domain_score > 0.5:
        why_matched.append(f"Strong domain overlap in {', '.join(overlap)}")
    elif len(overlap) > 0:
        why_matched.append(f"Domain overlap in {', '.join(overlap)}")
    
    # Location advantage
    if profile.location.country in grant.eligibility.location or "Global" in grant.eligibility.location:
        if profile.location.state:
            why_matched.append(f"Your location ({profile.location.city or profile.location.state}) may give regional advantage")
    
    # Stage match
    if profile.stage in grant.eligibility.stages:
        if profile.stage in ["prototype", "registered"]:
            why_matched.append(f"Your {profile.stage} stage is ideal for this grant")
    
    # Funding alignment
    if profile.project.funding_needed <= grant.amount:
        why_matched.append(f"Grant amount (${grant.amount:,}) covers your funding need")
    
    # Credentials boost
    if profile.credentials.publications > 0:
        why_matched.append(f"Your {profile.credentials.publications} publications strengthen your application")
    if profile.credentials.patents > 0:
        why_matched.append(f"Your {profile.credentials.patents} patent(s) demonstrate innovation")
    if len(profile.credentials.previous_grants) > 0:
        why_matched.append("Previous grant experience improves credibility")
    
    return {
        "why_matched": why_matched[:4],  # Top 4 reasons
        "action_items": action_items[:3],  # Top 3 action items
        "eligibility_concerns": eligibility_issues[:2] if eligibility_score < 0.8 else []
    }
