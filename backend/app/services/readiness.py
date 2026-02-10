"""
Profile completeness and readiness scoring
"""
from typing import Dict, List
from app.models.user import UserProfile, ReadinessScore


def calculate_readiness_score(profile: UserProfile) -> ReadinessScore:
    """
    Calculate a readiness score (0-100) for a user profile
    """
    category_scores = {}
    improvements = []
    strong_areas = []
    
    # Basic Info Score (20 points max)
    basic_score = 0
    if profile.user_type:
        basic_score += 5
    if len(profile.domains) > 0:
        basic_score += 5
    if len(profile.domains) >= 2:
        basic_score += 5
    if profile.location.country and profile.location.state:
        basic_score += 5
    category_scores["basic_info"] = basic_score
    
    if basic_score >= 15:
        strong_areas.append("Complete basic profile information")
    if len(profile.domains) < 2:
        improvements.append({
            "area": "Domains",
            "points_gain": 5,
            "action": "Add at least 2 focus domains to improve matching"
        })
    
    # Project Score (30 points max)
    project_score = 0
    if profile.project.title:
        project_score += 5
    if len(profile.project.description) > 50:
        project_score += 10
    if len(profile.project.description) > 200:
        project_score += 5
    if len(profile.project.keywords) >= 3:
        project_score += 5
    if profile.project.funding_needed > 0:
        project_score += 5
    category_scores["project_details"] = project_score
    
    if project_score >= 25:
        strong_areas.append("Strong project description")
    if len(profile.project.description) < 200:
        improvements.append({
            "area": "Project Description",
            "points_gain": 10,
            "action": "Expand project description to 200+ characters for better AI matching"
        })
    if len(profile.project.keywords) < 3:
        improvements.append({
            "area": "Keywords",
            "points_gain": 5,
            "action": "Add at least 3 project keywords"
        })
    
    # Organization Score (25 points max)
    org_score = 0
    if profile.organization.type:
        org_score += 5
    if profile.organization.registered:
        org_score += 10
    if profile.organization.team_size >= 2:
        org_score += 5
    if profile.organization.founding_date:
        org_score += 5
    category_scores["organization"] = org_score
    
    if org_score >= 20:
        strong_areas.append("Established organization status")
    if not profile.organization.registered:
        improvements.append({
            "area": "Registration",
            "points_gain": 10,
            "action": "Register your company/organization to unlock more grants"
        })
    
    # Credentials Score (25 points max)
    cred_score = 0
    if len(profile.credentials.previous_grants) > 0:
        cred_score += 10
    if profile.credentials.publications > 0:
        cred_score += 8
    if profile.credentials.patents > 0:
        cred_score += 7
    category_scores["credentials"] = cred_score
    
    if cred_score >= 15:
        strong_areas.append("Strong credentials and track record")
    if len(profile.credentials.previous_grants) == 0:
        improvements.append({
            "area": "Previous Grants",
            "points_gain": 10,
            "action": "List any previous grants received (even small ones)"
        })
    if profile.credentials.publications == 0:
        improvements.append({
            "area": "Publications",
            "points_gain": 8,
            "action": "Add publication count to boost credibility"
        })
    
    # Calculate overall score
    overall_score = sum(category_scores.values())
    
    # Sort improvements by points gain
    improvements.sort(key=lambda x: x["points_gain"], reverse=True)
    
    return ReadinessScore(
        overall_score=overall_score,
        category_scores=category_scores,
        improvements=improvements[:5],  # Top 5 improvements
        strong_areas=strong_areas
    )
