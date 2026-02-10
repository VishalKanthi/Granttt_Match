from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import json
import os
from app.models.user import UserProfile, ProfileResponse, ReadinessScore
from app.models.grant import MatchResponse, Grant, MatchResult, ApplicationTips
from app.services.matcher import MatcherService
from app.services.readiness import calculate_readiness_score
from app.services.ai_assistant import generate_application_tips

router = APIRouter()

# Load grants data
def get_grants():
    # In a real app, this would be a database
    # For MVP, we load from JSON and cache in memory
    if hasattr(get_grants, "data"):
        return get_grants.data
    
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "grants.json")
    with open(file_path, "r") as f:
        data = json.load(f)
        grants = [Grant(**g) for g in data]
        get_grants.data = grants
        return grants

# Initialize matcher service
def get_matcher():
    if hasattr(get_matcher, "service"):
        return get_matcher.service
    
    grants = get_grants()
    service = MatcherService(grants)
    get_matcher.service = service
    return service

# In-memory profile storage for MVP
profiles_db = {}

@router.post("/profile/create", response_model=ProfileResponse)
async def create_profile(profile: UserProfile):
    import uuid
    if not profile.id:
        profile.id = str(uuid.uuid4())
    
    # Calculate score
    readiness = calculate_readiness_score(profile)
    
    # Save to "db"
    profiles_db[profile.id] = profile
    
    return ProfileResponse(
        profile_id=profile.id,
        completeness_score=readiness.overall_score,
        profile=profile
    )

@router.get("/profile/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: str):
    if profile_id not in profiles_db:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile = profiles_db[profile_id]
    readiness = calculate_readiness_score(profile)
    
    return ProfileResponse(
        profile_id=profile.id,
        completeness_score=readiness.overall_score,
        profile=profile
    )

@router.get("/readiness-score", response_model=ReadinessScore)
async def get_readiness_score(profile_id: str):
    if profile_id not in profiles_db:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile = profiles_db[profile_id]
    return calculate_readiness_score(profile)

@router.post("/match", response_model=MatchResponse)
async def get_matches(profile_id: Optional[str] = None, profile: Optional[UserProfile] = None):
    # Support both existing profile ID or transient profile
    if profile_id and profile_id in profiles_db:
        user_profile = profiles_db[profile_id]
    elif profile:
        user_profile = profile
    else:
        raise HTTPException(status_code=400, detail="Either profile_id or profile data must be provided")
    
    matcher = get_matcher()
    matches = matcher.match(user_profile)
    
    # Calculate totals
    total_funding = sum(m.grant.amount for m in matches if m.match_score > 60)
    
    readiness = calculate_readiness_score(user_profile)
    
    return MatchResponse(
        matches=matches,
        total_funding=total_funding,
        total_matches=len(matches),
        profile_score=readiness.overall_score
    )

@router.get("/grants/{grant_id}", response_model=Grant)
async def get_grant_details(grant_id: str):
    grants = get_grants()
    for g in grants:
        if g.id == grant_id:
            return g
    raise HTTPException(status_code=404, detail="Grant not found")

@router.post("/grants/{grant_id}/analyze", response_model=ApplicationTips)
async def analyze_grant(grant_id: str, profile_id: str):
    if profile_id not in profiles_db:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile = profiles_db[profile_id]
    
    grants = get_grants()
    grant = next((g for g in grants if g.id == grant_id), None)
    
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")
    
    # Re-calculate match score to be accurate
    matcher = get_matcher()
    matches = matcher.match(profile)
    match_result = next((m for m in matches if m.grant.id == grant_id), None)
    match_score = match_result.match_score if match_result else 50
    
    return generate_application_tips(profile, grant, match_score)

@router.get("/timeline")
async def get_timeline_grants():
    grants = get_grants()
    # Sort by deadline
    sorted_grants = sorted(grants, key=lambda x: x.deadline)
    return sorted_grants
