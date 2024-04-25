from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.orm import relationship


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    phone = db.Column(db.Integer, nullable=False, unique=True)
    school = db.Column(db.String(255))
    biography = db.Column(db.Text)
    sport = db.Column(db.String(50))
    position = db.Column(db.String(20))
    major = db.Column(db.String(50))
    graduation_year = db.Column(db.Integer)
    accolades = db.Column(db.Text)
    location = db.Column(db.String(50))
    hometown = db.Column(db.String(50))
    interests = db.Column(db.String(50))
    social_links = db.Column(db.String(50))
    profile_picture = db.Column(db.String(50))

    carts = relationship('Cart', back_populates='users')
    requests = relationship('Request', back_populates='users')
    opportunities = relationship('Opportunity', back_populates='users')
    reviews = relationship('Review', back_populates='users')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'school': self.school,
            'biography': self.biography,
            'sport': self.sport,
            'position': self.position,
            'major': self.major,
            'graduation_year': self.graduation_year,
            'accolades': self.accolades,
            'location': self.location,
            'hometown': self.hometown,
            'interests': self.interests,
            'social_links': self.social_links,
            'profile_picture': self.profile_picture


        }
