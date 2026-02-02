from flask import Blueprint
from app.controllers.github_repos_controller import list_github_repos

github_repos_bp = Blueprint("github_repos", __name__, url_prefix="/api/github")

github_repos_bp.get("/repos")(list_github_repos)
