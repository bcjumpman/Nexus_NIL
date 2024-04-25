from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    magic = User(
        username='Magic', email='magic@aa.io', password='password', first_name='Magic', last_name='Johnson', phone='123456789')
    kobe = User(
        username='Kobe', email='kobe@aa.io', password='password', first_name='Kobe', last_name='Bryant', phone='123456780')
    michael = User(
        username='Michael', email='michael@aa.io', password='password', first_name='Michael', last_name='Jordan', phone='123456781')

    db.session.add(magic)
    db.session.add(kobe)
    db.session.add(michael)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
