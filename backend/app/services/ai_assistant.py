"""
AI Application Assistant - generates tailored tips for grant applications
"""
from typing import List
from app.models.user import UserProfile
from app.models.grant import Grant, ApplicationTips


def generate_application_tips(profile: UserProfile, grant: Grant, match_score: int) -> ApplicationTips:
    """
    Generate personalized application tips for a specific grant match
    """
    key_strengths = []
    talking_points = []
    concerns = []
    
    # Analyze domain alignment for strengths
    user_domains = set(d.lower() for d in profile.domains)
    grant_areas = set(a.lower() for a in grant.focus_areas)
    overlap = user_domains & grant_areas
    
    if overlap:
        for domain in list(overlap)[:2]:
            key_strengths.append(f"Emphasize your {domain} expertise—this grant prioritizes {domain} innovation")
    
    # Location-based strengths
    if profile.location.city or profile.location.state:
        location_str = profile.location.city or profile.location.state
        if profile.location.country in grant.eligibility.location or "Global" in grant.eligibility.location:
            key_strengths.append(f"Mention your {location_str} location—regional presence can strengthen your application")
    
    # Stage-based strengths
    if profile.stage == "prototype":
        key_strengths.append("Highlight your working prototype—demonstrates execution capability")
    elif profile.stage == "registered":
        key_strengths.append("Emphasize your registered status—shows commitment and legitimacy")
    elif profile.stage == "revenue":
        key_strengths.append("Showcase your revenue traction—proves market validation")
    
    # Team-based strengths
    if profile.organization.team_size >= 3:
        key_strengths.append(f"Highlight your team of {profile.organization.team_size}—shows capacity to execute")
    
    # Credentials strengths
    if profile.credentials.publications > 0:
        key_strengths.append(f"Reference your {profile.credentials.publications} publications to establish credibility")
    if profile.credentials.patents > 0:
        key_strengths.append(f"Mention your {profile.credentials.patents} patent(s) to demonstrate IP protection")
    if profile.credentials.previous_grants:
        key_strengths.append("Cite previous grant success to prove track record")
    
    # Generate talking points based on grant focus
    if profile.project.title:
        talking_points.append(
            f"Our solution, {profile.project.title}, directly addresses the grant's focus on "
            f"{', '.join(grant.focus_areas[:2])}"
        )
    
    if profile.project.funding_needed:
        talking_points.append(
            f"We're seeking ${profile.project.funding_needed:,} to "
            f"{'complete development' if profile.stage == 'prototype' else 'scale operations'} "
            f"within {profile.project.timeline}"
        )
    
    # Impact statement
    talking_points.append(
        f"Expected impact aligns with {grant.organization}'s mission of supporting {grant.focus_areas[0].lower()} innovation"
    )
    
    # Concerns and areas to address
    if not profile.organization.registered and grant.eligibility.requires_registration:
        concerns.append("You're pre-registration—clearly state your incorporation timeline in the application")
    
    if profile.organization.team_size < 2:
        concerns.append("Single founder—emphasize advisors or planned hires to show team growth potential")
    
    if len(profile.credentials.previous_grants) == 0:
        concerns.append("No previous grants—highlight relevant experience or pilot projects instead")
    
    if profile.stage == "idea":
        concerns.append("Early stage—focus on market research, team expertise, and execution roadmap")
    
    # Competition level insight
    if grant.competition_level == "high":
        concerns.append(f"High competition ({grant.past_winners}+ past winners)—ensure unique differentiation")
    
    # Calculate competitiveness based on match score and grant difficulty
    if match_score >= 85 and grant.difficulty != "hard":
        competitiveness = "high"
        estimated_rate = grant.success_rate * 1.5
    elif match_score >= 70:
        competitiveness = "medium-high"
        estimated_rate = grant.success_rate * 1.2
    elif match_score >= 55:
        competitiveness = "medium"
        estimated_rate = grant.success_rate
    else:
        competitiveness = "low"
        estimated_rate = grant.success_rate * 0.7
    
    return ApplicationTips(
        key_strengths=key_strengths[:5],
        talking_points=talking_points[:4],
        concerns=concerns[:4],
        competitiveness=competitiveness,
        estimated_success_rate=min(0.5, estimated_rate)
    )
