from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class Location(BaseModel):
    country: str = "India"
    state: Optional[str] = None
    city: Optional[str] = None


class Organization(BaseModel):
    type: str = "company"  # company, individual, institute, ngo
    registered: bool = False
    team_size: int = 1
    founding_date: Optional[str] = None


class Project(BaseModel):
    title: str = ""
    description: str = ""
    keywords: List[str] = []
    funding_needed: int = 0
    timeline: str = "12 months"


class Credentials(BaseModel):
    previous_grants: List[str] = []
    publications: int = 0
    patents: int = 0


class UserProfile(BaseModel):
    id: Optional[str] = None
    user_type: str = "startup"  # startup, researcher, ngo, student
    domains: List[str] = []
    location: Location = Location()
    stage: str = "idea"  # idea, prototype, registered, revenue, scaling
    organization: Organization = Organization()
    project: Project = Project()
    credentials: Credentials = Credentials()
    created_at: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_type": "startup",
                "domains": ["AI", "Healthcare"],
                "location": {"country": "India", "state": "Karnataka", "city": "Bangalore"},
                "stage": "prototype",
                "organization": {"type": "company", "registered": False, "team_size": 3},
                "project": {
                    "title": "AI Diagnostic Tool",
                    "description": "Using computer vision to detect diseases from medical imaging",
                    "keywords": ["medical imaging", "deep learning"],
                    "funding_needed": 50000,
                    "timeline": "12 months"
                },
                "credentials": {"previous_grants": [], "publications": 2, "patents": 0}
            }
        }


class ProfileResponse(BaseModel):
    profile_id: str
    completeness_score: int
    profile: UserProfile


class ReadinessScore(BaseModel):
    overall_score: int
    category_scores: dict
    improvements: List[dict]
    strong_areas: List[str]
