from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime

class Review(db.Model):
  __tablename__ = 'reviews'

  if environment == "production":
    __table_args__ = {'schema': SCHEMA}

  id = Column(Integer, primary_key=True)
  user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
  opportunity_id = Column(Integer, ForeignKey(add_prefix_for_prod('opportunities.id')), nullable=False)
  rating = Column(Integer, nullable=False)
  verified_booking = Column(Boolean, nullable=False)
  description = Column(Text)
  created_at = Column(db.DateTime, default=datetime.utcnow)
  updated_at = Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  users = relationship('User', back_populates='reviews')
  opportunities = relationship('Product', back_populates='reviews')

  def to_dict(self):
      return {
          'id': self.id,
          'user_id': self.user_id,
          'opportunity_id': self.opportunity_id,
          'rating': self.rating,
          'verified_booking': self.verified_booking,
          'description': self.description,
          'created_at': self.created_at,
          'updated_at': self.updated_at
      }
