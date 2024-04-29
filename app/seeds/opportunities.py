from app.models import db, Opportunity, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random
from datetime import datetime

# Initialize Faker
fake = Faker()

# Some companies
companies = [
    "Apple", "Google", "Microsoft", "Amazon", "Facebook", "Tesla", "Berkshire Hathaway", "Visa",
    "JPMorgan Chase", "Johnson & Johnson", "Walmart", "Mastercard", "Procter & Gamble", "Intel",
    "UnitedHealth", "Verizon", "Home Depot", "Kraft Heinz", "NVIDIA", "Disney", "PayPal", "Netflix",
    "Coca Cola", "Adobe", "Cisco Systems", "PepsiCo", "Oracle", "Comcast", "Chevron", "ExxonMobil"
]

def seed_opportunities():
    # Add specific opportunities
    for i in range(100):
        opportunity = Opportunity(
            user_id=random.randint(1, 3),
            title=random.choice(companies),
            rate=round(random.uniform(100.0, 1000.0), 2),
            type=random.choice(['Birthday shoutouts', 'Endorsements', 'Autographs', 'Appearances']),
            image=fake.image_url(),
            description=fake.paragraph(nb_sentences=5),
            multiple_days=fake.boolean(),
            number_of_days=random.randint(1, 3) if fake.boolean() else 1,
            contact_information=fake.phone_number(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(opportunity)
    db.session.commit()

def undo_opportunities():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.opportunities RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM opportunities"))

    db.session.commit()
