from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
from flask_login import login_user, logout_user, current_user

from app.extensions import db
from app.models import User


def register():
    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not username or not email or not password:
        return jsonify({"error": "Username, email and password are required."}), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify({"error": "Invalid email address."}), 400

    exists = User.query.filter_by(email=email).first()
    if exists:
        return jsonify({"error": "Email already exists."}), 409

    exists = User.query.filter_by(username=username).first()
    if exists:
        return jsonify({"error": "Username already exists."}), 409

    user = User(
        username=username,
        email=email,
        password=generate_password_hash(password),
    )

    db.session.add(user)
    db.session.commit()

    login_user(user)

    return jsonify(
        {
            "message": "Registered successfully.",
            "user": {"id": user.id, "username": user.username, "email": user.email, "role": user.role},
        }
    ), 201


def login():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid credentials."}), 401

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials."}), 401

    login_user(user)

    return jsonify(
        {
            "message": "Logged in.",
            "user": {"id": user.id, "username": user.username, "email": user.email, "role": user.role},
        }
    ), 200


def logout():
    if current_user.is_authenticated:
        logout_user()
    return jsonify({"message": "Logged out."}), 200


def me():
    if not current_user.is_authenticated:
        return jsonify({"user": None}), 200

    return jsonify(
        {
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "role": current_user.role,
            }
        }
    ), 200