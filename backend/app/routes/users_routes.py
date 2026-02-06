from flask import Blueprint
from app.controllers.users_controller import list_users

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

users_bp.get("")(list_users)
