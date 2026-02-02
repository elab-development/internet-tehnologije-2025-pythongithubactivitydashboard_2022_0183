from flask import request, jsonify
from flask_login import current_user

from app.extensions import db
from app.models import Repository
from app.middlewares.require_auth import require_auth
from app.utils.github_client import get_github_client_for_current_user


def list_saved_repos():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    repos = Repository.query.filter_by(user_id=current_user.id).order_by(Repository.created_at.desc()).all()
    return jsonify({
        "repos": [
            {
                "id": r.id,
                "githubId": r.github_id,
                "name": r.name,
                "owner": r.owner,
                "url": r.url,
                "description": r.description,
                "createdAt": r.created_at.isoformat(),
            }
            for r in repos
        ]
    }), 200


def add_repo():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    data = request.get_json(silent=True) or {}
    github_id = data.get("githubId")

    if not github_id:
        return jsonify({"error": "githubId is required."}), 400

    exists = Repository.query.filter_by(user_id=current_user.id, github_id=github_id).first()
    if exists:
        return jsonify({"error": "Repository already saved.", "repoId": exists.id}), 409

    gh = get_github_client_for_current_user()
    if not gh:
        return jsonify({"error": "GitHub token not set."}), 400

    try:
        repo = gh.get_repo(int(github_id))

        new_repo = Repository(
            user_id=current_user.id,
            github_id=repo.id,
            name=repo.name,
            owner=repo.owner.login if repo.owner else repo.full_name.split("/")[0],
            url=repo.html_url,
            description=repo.description,
        )

        db.session.add(new_repo)
        db.session.commit()

        return jsonify({
            "message": "Repository saved.",
            "repo": {
                "id": new_repo.id,
                "githubId": new_repo.github_id,
                "name": new_repo.name,
                "owner": new_repo.owner,
                "url": new_repo.url,
                "description": new_repo.description,
            }
        }), 201
    except Exception as e:
        return jsonify({"error": "Failed to save repo.", "message": str(e)}), 502


def delete_repo(repo_id: int):
    auth_err = require_auth()
    if auth_err:
        return auth_err

    repo = Repository.query.filter_by(id=repo_id, user_id=current_user.id).first()
    if not repo:
        return jsonify({"error": "Repository not found."}), 404

    db.session.delete(repo)
    db.session.commit()

    return jsonify({"message": "Repository removed from dashboard."}), 200
