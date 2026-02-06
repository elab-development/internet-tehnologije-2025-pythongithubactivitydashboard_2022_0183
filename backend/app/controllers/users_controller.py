from flask import jsonify
from app.models import User
from app.middlewares.require_admin import require_admin

def list_users():
    err = require_admin()
    if err:
        return err

    users = User.query.order_by(User.created_at.desc()).all()

    return jsonify({
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "createdAt": u.created_at.isoformat() if u.created_at else None,
            }
            for u in users
        ]
    }), 200
