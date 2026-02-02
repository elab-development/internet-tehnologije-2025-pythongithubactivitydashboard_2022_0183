from flask_login import current_user
from github import Github

from app.models import ApiKey
from app.utils.crypto import decrypt_token

def get_github_client_for_current_user() -> Github | None:
    key = ApiKey.query.filter_by(user_id=current_user.id).first()
    if not key:
        return None
    token = decrypt_token(key.token_encrypted)
    return Github(token)
