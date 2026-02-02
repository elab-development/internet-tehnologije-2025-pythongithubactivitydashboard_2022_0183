from flask_login import UserMixin
from app.extensions import db

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now(), nullable=False)

    api_key = db.relationship("ApiKey", back_populates="user", uselist=False, cascade="all, delete-orphan")
    repositories = db.relationship("Repository", backref="user", cascade="all, delete-orphan")


class ApiKey(db.Model):
    __tablename__ = "api_keys"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    token_encrypted = db.Column(db.Text, nullable=False)
    last_validated_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now(), nullable=False)

    user = db.relationship("User", back_populates="api_key")


class Repository(db.Model):
    __tablename__ = "repositories"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    github_id = db.Column(db.BigInteger, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    owner = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now(), nullable=False)

    __table_args__ = (
        db.UniqueConstraint("user_id", "github_id", name="uq_repo_user_github"),
        db.UniqueConstraint("user_id", "url", name="uq_repo_user_url"),
    )