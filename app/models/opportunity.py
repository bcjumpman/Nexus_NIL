from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime


class Opportunity(db.Model):
    __tablename__ = 'opportunities'


    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}


    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    title = Column(String, nullable=False)
    rate = Column(Float, nullable=False)
    type = Column(String, nullable=False)
    image = Column(String)
    description = Column(Text)
    multiple_days = Column(Boolean)
    number_of_days = Column(Integer)
    contact_information = Column(String)
    created_at = Column(db.DateTime, default=datetime.utcnow)
    updated_at = Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)



    users = relationship('User', back_populates='opportunities')
    add_to_cart = relationship('AddToCart', back_populates='opportunities')
    reviews = relationship('Review', back_populates='opportunities', cascade='all, delete-orphan')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'rate': self.rate,
            'type': self.type,
            'multiple_days': self.multiple_days,
            'number_of_days': self.number_of_days,
            'image': self.image,
            'description': self.description,
            'contact_information': self.contact_information,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
