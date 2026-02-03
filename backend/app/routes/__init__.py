from app.routes.auth_routes import auth_bp
from app.routes.api_key_routes import api_key_bp
from app.routes.github_repos_routes import github_repos_bp
from app.routes.repository_routes import repos_bp
from app.routes.activity_routes import activities_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_key_bp)
    app.register_blueprint(github_repos_bp)
    app.register_blueprint(repos_bp)
    app.register_blueprint(activities_bp)