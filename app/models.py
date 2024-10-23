from . import db
from sqlalchemy import func

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())
class TokenBlacklist(db.Model):
    __tablename__ = "token_blacklists"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(512), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now()) 
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (
        db.UniqueConstraint('token', name="uq_token"),
    )

    def __repr__(self):
        return f'<TokenBlacklist {self.token}>'

