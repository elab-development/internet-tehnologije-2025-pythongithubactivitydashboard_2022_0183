from flask import jsonify
from flask_login import current_user
from app.middlewares.require_auth import require_auth

def require_admin():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    if getattr(current_user, "role", "user") != "admin":
        return jsonify({"error": "Forbidden."}), 403

    return None
