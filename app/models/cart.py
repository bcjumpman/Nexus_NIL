from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .addtocart import AddToCart

class Cart(db.Model):
    __tablename__ = 'carts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = Column(db.DateTime, default=datetime.utcnow)
    updated_at = Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship('User', back_populates='carts')
    requests = relationship('Request', back_populates='carts', cascade='all, delete-orphan')
    add_to_cart = relationship('AddToCart', back_populates='carts', cascade='all, delete-orphan')

    @property
    def cart_items(self):
        if self.add_to_cart:
            cart_items = []
            for item in self.add_to_cart:
                if isinstance(item, AddToCart):
                    cart_items.append(item.to_dict())
            return cart_items
        else:
            return []

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'cart_items': self.cart_items,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'updated_at': self.updated_at.strftime("%Y-%m-%d %H:%M:%S")
        }
