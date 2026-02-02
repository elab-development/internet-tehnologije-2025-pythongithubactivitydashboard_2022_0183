from flask import Blueprint
from app.controllers.api_key_controller import (
    set_github_token,
    get_github_token_status,
    delete_github_token,
)

api_key_bp = Blueprint("api_key", __name__, url_prefix="/api/keys")

api_key_bp.post("/github")(set_github_token)
api_key_bp.get("/github")(get_github_token_status)
api_key_bp.delete("/github")(delete_github_token)
