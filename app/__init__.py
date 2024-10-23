from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

# setup db
db = SQLAlchemy()
migrate = Migrate()

# load env from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)

    # db env setup
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['WTF_CSRF_ENABLED'] = False

    # jwt setup
    JWTManager(app)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")

    # setting up db with flask app
    db.init_app(app)
    migrate.init_app(app, db)
    from .models import User
    #with app.app_context():
    #    db.session.query(User).delete()
    #    db.session.commit()
    CORS(app)

    # registering routers with flask app
    from .router import main
    app.register_blueprint(main)

    return app

