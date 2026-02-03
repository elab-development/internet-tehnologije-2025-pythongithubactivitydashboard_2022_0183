from flask import request, jsonify
from flask_login import current_user
from sqlalchemy import or_
from datetime import datetime

from app.middlewares.require_auth import require_auth
from app.models import (
    Repository,
    Activity,
    ActivityType,
    CommitActivity,
    IssueActivity,
    PullRequestActivity,
)

def _parse_iso(dt_str: str | None):
    if not dt_str:
        return None
    return datetime.fromisoformat(dt_str)

def list_activities(repo_id: int):
    auth_err = require_auth()
    if auth_err:
        return auth_err

    repo = Repository.query.filter_by(id=repo_id, user_id=current_user.id).first()
    if not repo:
        return jsonify({"error": "Repository not found."}), 404

    type_str = (request.args.get("type") or "").strip()
    actor = (request.args.get("actor") or "").strip()
    q = (request.args.get("q") or "").strip()

    dt_from = _parse_iso(request.args.get("from"))
    dt_to = _parse_iso(request.args.get("to"))

    page = int(request.args.get("page", "1"))
    page_size = int(request.args.get("pageSize", "25"))
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)

    query = Activity.query.filter(Activity.repository_id == repo.id)

    if type_str:
        try:
            query = query.filter(Activity.type == ActivityType(type_str))
        except Exception:
            return jsonify({"error": "Invalid type. Use commit|issue|pull_request."}), 400

    if actor:
        query = query.filter(Activity.actor.ilike(actor))

    if dt_from:
        query = query.filter(Activity.occurred_at >= dt_from)
    if dt_to:
        query = query.filter(Activity.occurred_at <= dt_to)

    if q:
        query = (
            query.outerjoin(CommitActivity, CommitActivity.activity_id == Activity.id)
                 .outerjoin(IssueActivity, IssueActivity.activity_id == Activity.id)
                 .outerjoin(PullRequestActivity, PullRequestActivity.activity_id == Activity.id)
                 .filter(or_(
                     CommitActivity.message.ilike(f"%{q}%"),
                     IssueActivity.title.ilike(f"%{q}%"),
                     PullRequestActivity.title.ilike(f"%{q}%"),
                 ))
        )

    query = query.order_by(Activity.occurred_at.desc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    out = []
    for a in items:
        base = {
            "id": a.id,
            "type": a.type.value,
            "githubEventId": a.github_event_id,
            "actor": a.actor,
            "occurredAt": a.occurred_at.isoformat(),
        }

        if a.type == ActivityType.commit and a.commit:
            base["commit"] = {
                "message": a.commit.message,
                "additions": a.commit.additions,
                "deletions": a.commit.deletions,
                "url": a.commit.url,
            }
        elif a.type == ActivityType.issue and a.issue:
            base["issue"] = {
                "title": a.issue.title,
                "state": a.issue.state,
                "closedAt": a.issue.closed_at.isoformat() if a.issue.closed_at else None,
                "url": a.issue.url,
            }
        elif a.type == ActivityType.pull_request and a.pull_request:
            base["pullRequest"] = {
                "title": a.pull_request.title,
                "state": a.pull_request.state,
                "merged": a.pull_request.merged,
                "mergedAt": a.pull_request.merged_at.isoformat() if a.pull_request.merged_at else None,
                "url": a.pull_request.url,
            }

        out.append(base)

    return jsonify({
        "repoId": repo.id,
        "page": page,
        "pageSize": page_size,
        "total": total,
        "items": out
    }), 200
