from flask import Blueprint
from app.controllers.activity_controller import list_activities

activities_bp = Blueprint("activities", __name__, url_prefix="/api/repos")

activities_bp.get("/<int:repo_id>/activities")(list_activities)
