"""
Main Grant Matching Service - combines all scoring components
"""
from typing import List
from app.models.user import UserProfile
from app.models.grant import Grant, MatchResult
from app.services.embeddings import embeddings_service
from app.services.eligibility import check_eligibility, get_eligibility_status
from app.services.explainer import generate_explanation


class MatcherService:
    def __init__(self, grants: List[Grant]):
        self.grants = grants
        self._prepare_embeddings()
    
    def _prepare_embeddings(self):
        """Prepare TF-IDF embeddings for all grants"""
        grant_texts = [
            f"{g.name} {g.description} {' '.join(g.focus_areas)} {' '.join(g.tags)}"
            for g in self.grants
        ]
        embeddings_service.fit(grant_texts)
    
    def _create_user_text(self, profile: UserProfile) -> str:
        """Create searchable text from user profile"""
        return (
            f"{profile.project.title} {profile.project.description} "
            f"{' '.join(profile.domains)} {' '.join(profile.project.keywords)}"
        )
    
    def _calculate_domain_match(self, profile: UserProfile, grant: Grant) -> float:
        """Calculate domain overlap score (0-1)"""
        user_domains = set(d.lower() for d in profile.domains)
        grant_areas = set(a.lower() for a in grant.focus_areas)
        if not user_domains or not grant_areas:
            return 0.5
        overlap = len(user_domains & grant_areas)
        return overlap / max(len(user_domains), len(grant_areas))
    
    def _calculate_strategic_fit(self, profile: UserProfile, grant: Grant) -> float:
        """Calculate strategic fit bonus score (0-1)"""
        score = 0.5
        if profile.stage in grant.eligibility.stages and profile.stage in ["prototype", "registered"]:
            score += 0.2
        if profile.location.country in grant.eligibility.location:
            score += 0.15
        if grant.amount >= profile.project.funding_needed > 0:
            score += 0.15
        return min(1.0, score)
    
    def match(self, profile: UserProfile, top_k: int = 25) -> List[MatchResult]:
        """Match user profile to grants using multi-factor scoring"""
        user_text = self._create_user_text(profile)
        similar_items = embeddings_service.find_similar(user_text, top_k=len(self.grants))
        
        results = []
        for grant_idx, semantic_sim in similar_items:
            grant = self.grants[grant_idx]
            domain_score = self._calculate_domain_match(profile, grant)
            eligibility_score, issues, actions = check_eligibility(profile, grant.eligibility)
            strategic_score = self._calculate_strategic_fit(profile, grant)
            
            final_score = semantic_sim*0.40 + domain_score*0.25 + eligibility_score*0.20 + strategic_score*0.15
            match_score = int(min(100, max(0, final_score * 100)))
            
            results.append(MatchResult(
                grant=grant, match_score=match_score,
                eligibility_status=get_eligibility_status(eligibility_score, issues),
                eligibility_issues=issues,
                explanation=generate_explanation(profile, grant, semantic_sim, domain_score, eligibility_score, issues, actions),
                semantic_score=semantic_sim, domain_score=domain_score,
                eligibility_score=eligibility_score, strategic_score=strategic_score
            ))
        
        results.sort(key=lambda x: x.match_score, reverse=True)
        return results[:top_k]
