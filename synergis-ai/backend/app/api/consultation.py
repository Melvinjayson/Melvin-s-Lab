from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..services.llm import LLMService
from ..services.recommendation import RecommendationService
from ..models.consultation import ConsultationResponse

router = APIRouter(prefix="/consultation", tags=["consultation"])

class Message(BaseModel):
    content: str
    context: Optional[dict] = None

class ConsultationHistory(BaseModel):
    messages: List[Message]
    metadata: Optional[dict] = None

@router.post("/", response_model=ConsultationResponse)
async def create_consultation(message: Message):
    """Create a new consultation message and get AI response"""
    try:
        # Initialize services
        llm_service = LLMService()
        recommendation_service = RecommendationService()

        # Process the message with LLM
        response = await llm_service.process_message(
            message.content,
            context=message.context
        )

        # Get product/service recommendations
        recommendations = await recommendation_service.get_recommendations(
            message.content,
            response
        )

        return ConsultationResponse(
            message=response,
            recommendations=recommendations,
            timestamp=datetime.now()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}", response_model=ConsultationHistory)
async def get_consultation_history(session_id: str):
    """Get consultation history for a specific session"""
    try:
        # TODO: Implement consultation history retrieval
        return ConsultationHistory(
            messages=[],
            metadata={"session_id": session_id}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/feedback")
async def submit_feedback(session_id: str, rating: int, feedback: Optional[str] = None):
    """Submit feedback for a consultation session"""
    try:
        # TODO: Implement feedback submission
        return {"status": "success", "message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))