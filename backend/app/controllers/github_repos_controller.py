from flask import jsonify
from flask_login import current_user

from app.middlewares.require_auth import require_auth
from app.utils.github_client import get_github_client_for_current_user

def list_github_repos():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    gh = get_github_client_for_current_user()
    if not gh:
        return jsonify({"error": "GitHub token not set."}), 400

    try:
        user = gh.get_user()

        repos = []
        for r in user.get_repos(type="owner"): 
            repos.append({
                "githubId": r.id,
                "name": r.name,
                "fullName": r.full_name,
                "owner": r.owner.login if r.owner else None,
                "url": r.html_url,
                "description": r.description,
                "private": r.private,
            })

        return jsonify({"repos": repos}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch repos from GitHub.", "message": str(e)}), 502
