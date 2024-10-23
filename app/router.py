from flask import Blueprint, jsonify, request
from .models import User, TokenBlacklist
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from . import db
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Length, Email
from werkzeug.security import generate_password_hash, check_password_hash

main = Blueprint("main", __name__)

class RegisterationForm(FlaskForm):
    name = StringField("name", validators=[
        DataRequired(), Length(min=3, max=80)
    ])
    email = StringField('Email', validators=[
        DataRequired(), 
        Email()
    ])
    password = PasswordField('Password', validators=[
        DataRequired(), 
        Length(min=6, max=80)
    ])
@main.post("/register")
def register():
    form = RegisterationForm(request.form)
    if not form.validate():
        return jsonify({'errors': form.errors}), 400

    user = User(name=form.name.data, email=form.email.data, password=generate_password_hash(form.password.data))
    try:
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(user.email)
        return jsonify({"access_token":access_token, "name": form.name.data}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "error registering"}), 500


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired(), 
        Email()
    ])
    password = PasswordField('Password', validators=[
        DataRequired(), 
        Length(min=6, max=80)
    ])

@main.post("/login")
def index():
    form = LoginForm(request.form)
    if not form.validate():
        return jsonify({'errors': form.errors}), 400

    try:
        user = User.query.filter_by(email=form.email.data).first()
        if not user:
            return jsonify(message="user not found"), 400

        if not check_password_hash(user.password, form.password.data):
            return jsonify(message="wrong email or password"), 400

        access_token = create_access_token(identity=user.email)
        return jsonify(access_token=access_token)
    except Exception as e:
        print(e)
        return jsonify({"message": "error registering"}), 500

@main.get("/logout")
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    blacklisted_token = TokenBlacklist(token=jti)
    db.session.add(blacklisted_token)
    db.session.commit()
    return jsonify(msg='Successfully logged out'), 200

@main.get("/user")
@jwt_required()
def user():
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        return {"name": user.name, "email": user.email, "created_at": user.created_at, "updated_at": user.updated_at}
    except Exception as e:
        print(e)
        return jsonify({"message":"error getting users"}), 400

class UpdateUserForm(FlaskForm):
    name = StringField("name", validators=[
        Length(min=3, max=80)
    ])
@main.put("/user")
@jwt_required()
def user_put():
    email = get_jwt_identity()
    form = UpdateUserForm(request.form)

    if not form.validate():
        return jsonify({'errors': form.errors}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(message='User not found'), 404

    user.name = form.name.data

    db.session.commit() 

    return jsonify(message='User updated successfully'), 200

@main.get("/users")
@jwt_required()
def users():
    try:
        users = User.query.all()
        return jsonify(users=[{"id":user.id, "name":user.name, "email":user.email, "created_at": user.created_at, "updated_at": user.updated_at} for user in users]), 200
    except Exception as e:
        print(e)
        return jsonify({"message":"error getting users"}), 400

