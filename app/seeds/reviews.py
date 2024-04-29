from faker import Faker
import random
from app.models import db, Review, Opportunity, User, environment, SCHEMA
from sqlalchemy.sql import text

fake = Faker()

def seed_reviews():
    # Fetch all opportunities
    opportunities = Opportunity.query.all()
    # Fetch all users
    users = User.query.all()

    for opportunity in opportunities:
        for _ in range(random.randint(1, 5)):
            new_review = Review(
                user_id=random.choice(users).id,
                opportunity_id=opportunity.id,
                rating=random.randint(1, 5),
                verified_booking=True,
                description=fake.text(max_nb_chars=200)
            )
            db.session.add(new_review)

    db.session.commit()


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
