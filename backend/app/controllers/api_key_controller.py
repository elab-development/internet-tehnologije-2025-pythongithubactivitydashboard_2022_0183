from datetime import datetime
from flask import request, jsonify
from github import Github
from github.GithubException import BadCredentialsException
from flask_login import current_user

from app.extensions import db
from app.models import ApiKey
from app.middlewares.require_auth import require_auth
from app.utils.crypto import encrypt_token


def set_github_token():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    data = request.get_json(silent=True) or {}
    token = (data.get("token") or "").strip()

    if not token:
        return jsonify({"error": "Token is required."}), 400

    # Validacija tokena
    try:
        gh = Github(token)
        gh.get_user().login
    except BadCredentialsException:
        return jsonify({"error": "Invalid GitHub token."}), 400
    except Exception as e:
        return jsonify({"error": "GitHub validation failed.", "message": str(e)}), 502

    token_encrypted = encrypt_token(token)

    key = ApiKey.query.filter_by(user_id=current_user.id).first()
    if key:
        key.token_encrypted = token_encrypted
        key.last_validated_at = datetime.utcnow()
    else:
        key = ApiKey(
            user_id=current_user.id,
            token_encrypted=token_encrypted,
            last_validated_at=datetime.utcnow(),
        )
        db.session.add(key)

    db.session.commit()

    return jsonify(
        {
            "message": "GitHub token saved.",
            "hasToken": True,
            "lastValidatedAt": key.last_validated_at.isoformat() if key.last_validated_at else None,
        }
    ), 200


def get_github_token_status():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    key = ApiKey.query.filter_by(user_id=current_user.id).first()
    if not key:
        return jsonify({"hasToken": False}), 200

    return jsonify(
        {
            "hasToken": True,
            "createdAt": key.created_at.isoformat(),
            "updatedAt": key.updated_at.isoformat(),
            "lastValidatedAt": key.last_validated_at.isoformat() if key.last_validated_at else None,
        }
    ), 200


def delete_github_token():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    key = ApiKey.query.filter_by(user_id=current_user.id).first()
    if not key:
        return jsonify({"message": "No token to delete.", "hasToken": False}), 200

    db.session.delete(key)
    db.session.commit()

    return jsonify({"message": "GitHub token deleted.", "hasToken": False}), 200
