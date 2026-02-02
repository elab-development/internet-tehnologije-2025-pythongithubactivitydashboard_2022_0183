from flask import jsonify
from flask_login import current_user

def require_auth():
    """
    Middleware helper: returns (response, status) if not authenticated, else None.
    """
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401
    return None
