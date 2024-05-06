from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', first_name='Demo', last_name='User', email='demo@aa.io', password='password')
    michael = User(
        username='Michael', first_name='Michael', last_name='Jackson', email='michael@aa.io', password='password')
    lionel = User(
        username='Lionel', first_name='Lionel', last_name='Messi', email='lionel@aa.io', password='password')
    usain = User(
        username='Usain', first_name='Usain', last_name='Bolt', email='usain@aa.io', password='password')
    tiger = User(
        username='Tiger', first_name='Tiger', last_name='Woods', email='tiger@aa.io', password='password')
    cristiano = User(
        username='Ronaldo', first_name='Cristiano', last_name='Ronaldo', email='cristiano@aa.io', password='password')

    db.session.add(demo)
    db.session.add(michael)
    db.session.add(lionel)
    db.session.add(usain)
    db.session.add(tiger)
    db.session.add(cristiano)
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
