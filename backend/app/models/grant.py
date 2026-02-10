from pydantic import BaseModel
from typing import List, Optional


class Eligibility(BaseModel):
    user_types: List[str] = ["startup", "researcher"]
    stages: List[str] = ["prototype", "registered"]
    location: List[str] = ["Global"]
    organization_types: List[str] = ["company", "institute"]
    min_team_size: int = 1
    requires_registration: bool = False
    max_company_age_years: Optional[int] = None
    technical_requirements: List[str] = []


class Grant(BaseModel):
    id: str
    name: str
    organization: str
    type: str  # government, accelerator, foundation, corporate, academic
    amount: int
    currency: str = "USD"
    equity_required: bool = False
    deadline: str
    description: str
    full_description: Optional[str] = None
    focus_areas: List[str] = []
    eligibility: Eligibility = Eligibility()
    benefits: List[str] = []
    difficulty: str = "medium"  # easy, medium, hard
    success_rate: float = 0.15
    application_time_estimate: str = "2 weeks"
    competition_level: str = "medium"  # low, medium, high
    past_winners: int = 0
    tags: List[str] = []
    website: str = ""
    contact_email: Optional[str] = None


class MatchResult(BaseModel):
    grant: Grant
    match_score: int  # 0-100
    eligibility_status: str  # eligible, needs_action, not_eligible
    eligibility_issues: List[str] = []
    explanation: dict  # why_matched, action_items
    semantic_score: float
    domain_score: float
    eligibility_score: float
    strategic_score: float


class MatchResponse(BaseModel):
    matches: List[MatchResult]
    total_funding: int
    total_matches: int
    profile_score: int


class ApplicationTips(BaseModel):
    key_strengths: List[str]
    talking_points: List[str]
    concerns: List[str]
    competitiveness: str  # low, medium, high, very_high
    estimated_success_rate: float
