from flask import request, jsonify
from flask_login import current_user
from datetime import datetime, timezone
from sqlalchemy import and_

from app.extensions import db
from app.models import (
    Repository,
    Activity,
    CommitActivity,
    IssueActivity,
    PullRequestActivity,
    ActivityType,
)
from app.middlewares.require_auth import require_auth
from app.utils.github_client import get_github_client_for_current_user


def list_saved_repos():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    repos = Repository.query.filter_by(user_id=current_user.id).order_by(Repository.created_at.desc()).all()
    return jsonify({
        "repos": [
            {
                "id": r.id,
                "githubId": r.github_id,
                "name": r.name,
                "owner": r.owner,
                "url": r.url,
                "description": r.description,
                "createdAt": r.created_at.isoformat(),
            }
            for r in repos
        ]
    }), 200


def add_repo():
    auth_err = require_auth()
    if auth_err:
        return auth_err

    data = request.get_json(silent=True) or {}
    github_id = data.get("githubId")

    if not github_id:
        return jsonify({"error": "githubId is required."}), 400

    exists = Repository.query.filter_by(user_id=current_user.id, github_id=github_id).first()
    if exists:
        return jsonify({"error": "Repository already saved.", "repoId": exists.id}), 409

    gh = get_github_client_for_current_user()
    if not gh:
        return jsonify({"error": "GitHub token not set."}), 400

    try:
        repo = gh.get_repo(int(github_id))

        new_repo = Repository(
            user_id=current_user.id,
            github_id=repo.id,
            name=repo.name,
            owner=repo.owner.login if repo.owner else repo.full_name.split("/")[0],
            url=repo.html_url,
            description=repo.description,
        )

        db.session.add(new_repo)
        db.session.commit()

        return jsonify({
            "message": "Repository saved.",
            "repo": {
                "id": new_repo.id,
                "githubId": new_repo.github_id,
                "name": new_repo.name,
                "owner": new_repo.owner,
                "url": new_repo.url,
                "description": new_repo.description,
            }
        }), 201
    except Exception as e:
        return jsonify({"error": "Failed to save repo.", "message": str(e)}), 502


def delete_repo(repo_id: int):
    auth_err = require_auth()
    if auth_err:
        return auth_err

    repo = Repository.query.filter_by(id=repo_id, user_id=current_user.id).first()
    if not repo:
        return jsonify({"error": "Repository not found."}), 404

    db.session.delete(repo)
    db.session.commit()

    return jsonify({"message": "Repository removed from dashboard."}), 200


def _dt_or_now(dt):
    return dt or datetime.now(timezone.utc)

def sync_repo(repo_id: int):
    auth_err = require_auth()
    if auth_err:
        return auth_err

    repo_row = Repository.query.filter_by(id=repo_id, user_id=current_user.id).first()
    if not repo_row:
        return jsonify({"error": "Repository not found."}), 404

    gh = get_github_client_for_current_user()
    if not gh:
        return jsonify({"error": "GitHub token not set."}), 400

    # query params
    prune = request.args.get("prune", "0") == "1"
    commit_limit = int(request.args.get("commitLimit", "50"))
    issue_limit = int(request.args.get("issueLimit", "50"))
    pr_limit = int(request.args.get("prLimit", "50"))

    seen_ids: set[str] = set()
    created = 0
    updated = 0

    try:
        gh_repo = gh.get_repo(int(repo_row.github_id))

        # ---- COMMITS ----
        # get_commits returns PaginatedList
        for c in gh_repo.get_commits()[:commit_limit]:
            event_id = str(c.sha)  
            seen_ids.add(event_id)

            base = Activity.query.filter_by(
                repository_id=repo_row.id,
                github_event_id=event_id,
            ).first()

            occurred_at = _dt_or_now(c.commit.author.date if c.commit and c.commit.author else None)

            if not base:
                base = Activity(
                    repository_id=repo_row.id,
                    type=ActivityType.commit,
                    github_event_id=event_id,
                    actor=(c.author.login if c.author else (c.commit.author.name if c.commit and c.commit.author else "unknown")),
                    occurred_at=occurred_at,
                )
                db.session.add(base)
                db.session.flush()  # da dobijemo base.id

                # Commit details: additions/deletions zahtevaju get_commit(sha) ili stats
                # c.stats ponekad nije popunjen bez dodatnog fetch-a:
                additions = 0
                deletions = 0
                try:
                    full_c = gh_repo.get_commit(c.sha)
                    additions = int(full_c.stats.additions) if full_c.stats else 0
                    deletions = int(full_c.stats.deletions) if full_c.stats else 0
                except Exception:
                    pass

                db.session.add(CommitActivity(
                    activity_id=base.id,
                    message=c.commit.message if c.commit else "",
                    additions=additions,
                    deletions=deletions,
                    url=c.html_url,
                ))
                created += 1
            else:
                # update basic fields
                base.actor = (c.author.login if c.author else base.actor)
                base.occurred_at = occurred_at
                updated += 1

        # ---- ISSUES ----
        # state="all" da uhvati open i closed
        # Napomena: GitHub issues endpoint vraća i PR kao issue; PyGithub Issue ima .pull_request atribut kad je PR
        issues_count = 0
        for iss in gh_repo.get_issues(state="all"):
            if issues_count >= issue_limit:
                break
            if getattr(iss, "pull_request", None):
                continue  # preskoči PR-ove ovde

            event_id = str(iss.id)
            seen_ids.add(event_id)
            issues_count += 1

            base = Activity.query.filter_by(
                repository_id=repo_row.id,
                github_event_id=event_id,
            ).first()

            occurred_at = _dt_or_now(iss.created_at)

            if not base:
                base = Activity(
                    repository_id=repo_row.id,
                    type=ActivityType.issue,
                    github_event_id=event_id,
                    actor=iss.user.login if iss.user else "unknown",
                    occurred_at=occurred_at,
                )
                db.session.add(base)
                db.session.flush()

                db.session.add(IssueActivity(
                    activity_id=base.id,
                    title=iss.title,
                    state=iss.state,
                    closed_at=iss.closed_at,
                    url=iss.html_url,
                ))
                created += 1
            else:
                base.type = ActivityType.issue
                base.actor = iss.user.login if iss.user else base.actor
                base.occurred_at = occurred_at
                updated += 1

        # ---- PULL REQUESTS ----
        prs_count = 0
        for pr in gh_repo.get_pulls(state="all", sort="updated", direction="desc"):
            if prs_count >= pr_limit:
                break
            prs_count += 1

            event_id = str(pr.id)
            seen_ids.add(event_id)

            base = Activity.query.filter_by(
                repository_id=repo_row.id,
                github_event_id=event_id,
            ).first()

            occurred_at = _dt_or_now(pr.created_at)

            merged = False
            merged_at = None
            try:
                merged = bool(pr.is_merged())
                merged_at = pr.merged_at
            except Exception:
                pass

            if not base:
                base = Activity(
                    repository_id=repo_row.id,
                    type=ActivityType.pull_request,
                    github_event_id=event_id,
                    actor=pr.user.login if pr.user else "unknown",
                    occurred_at=occurred_at,
                )
                db.session.add(base)
                db.session.flush()

                db.session.add(PullRequestActivity(
                    activity_id=base.id,
                    title=pr.title,
                    state=pr.state,
                    merged=merged,
                    merged_at=merged_at,
                    url=pr.html_url,
                ))
                created += 1
            else:
                base.type = ActivityType.pull_request
                base.actor = pr.user.login if pr.user else base.actor
                base.occurred_at = occurred_at
                updated += 1

        # ---- obriši ono što nije viđeno u sync-u ----
        deleted = 0
        if prune:
            # brišemo samo aktivnosti za ovaj repo koje nisu u seen_ids
            to_delete = Activity.query.filter(
                and_(
                    Activity.repository_id == repo_row.id,
                    ~Activity.github_event_id.in_(list(seen_ids)) if seen_ids else True
                )
            ).all()

            deleted = len(to_delete)
            for a in to_delete:
                db.session.delete(a)

        db.session.commit()

        return jsonify({
            "message": "Sync completed.",
            "repoId": repo_row.id,
            "created": created,
            "updated": updated,
            "deleted": deleted,
            "prune": prune,
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Sync failed.", "message": str(e)}), 502
    
    