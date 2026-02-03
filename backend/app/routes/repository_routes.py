from flask import Blueprint
from app.controllers.repository_controller import list_saved_repos, add_repo, delete_repo, sync_repo

repos_bp = Blueprint("repos", __name__, url_prefix="/api/repos")

repos_bp.get("")(list_saved_repos)
repos_bp.post("")(add_repo)
repos_bp.delete("/<int:repo_id>")(delete_repo)
repos_bp.post("/<int:repo_id>/sync")(sync_repo)
