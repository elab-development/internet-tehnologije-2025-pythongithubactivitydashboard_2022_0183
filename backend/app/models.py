import enum
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

    activities = db.relationship("Activity", backref="repository", cascade="all, delete-orphan")


class ActivityType(enum.Enum):
    commit = "commit"
    issue = "issue"
    pull_request = "pull_request"


class Activity(db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)

    repository_id = db.Column(
        db.Integer,
        db.ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    type = db.Column(db.Enum(ActivityType, name="activity_type"), nullable=False)

    github_event_id = db.Column(db.String(64), nullable=False)
    actor = db.Column(db.String(255), nullable=False, index=True)
    occurred_at = db.Column(db.DateTime, nullable=False, index=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now(), nullable=False)

    commit = db.relationship("CommitActivity", back_populates="activity", uselist=False, cascade="all, delete-orphan")
    issue = db.relationship("IssueActivity", back_populates="activity", uselist=False, cascade="all, delete-orphan")
    pull_request = db.relationship("PullRequestActivity", back_populates="activity", uselist=False, cascade="all, delete-orphan")

    __table_args__ = (
        db.UniqueConstraint("repository_id", "github_event_id", name="uq_activity_repo_ghevent"),
    )


class CommitActivity(db.Model):
    __tablename__ = "commit_activities"

    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(
        db.Integer,
        db.ForeignKey("activities.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    message = db.Column(db.Text, nullable=False)
    additions = db.Column(db.Integer, nullable=False, server_default="0")
    deletions = db.Column(db.Integer, nullable=False, server_default="0")
    url = db.Column(db.String(255), nullable=False)

    activity = db.relationship("Activity", back_populates="commit")


class IssueActivity(db.Model):
    __tablename__ = "issue_activities"

    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(
        db.Integer,
        db.ForeignKey("activities.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    title = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(20), nullable=False)  
    closed_at = db.Column(db.DateTime, nullable=True)
    url = db.Column(db.String(255), nullable=False)

    activity = db.relationship("Activity", back_populates="issue")


class PullRequestActivity(db.Model):
    __tablename__ = "pull_request_activities"

    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(
        db.Integer,
        db.ForeignKey("activities.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    title = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(20), nullable=False)  
    merged = db.Column(db.Boolean, nullable=False, server_default=db.text("false"))
    merged_at = db.Column(db.DateTime, nullable=True)
    url = db.Column(db.String(255), nullable=False)

    activity = db.relationship("Activity", back_populates="pull_request")

