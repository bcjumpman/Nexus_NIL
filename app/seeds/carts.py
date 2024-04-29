from app.models import db, Cart, environment, SCHEMA
from sqlalchemy.sql import text

def seed_carts():
    cart1 = Cart(user_id=1)
    cart2 = Cart(user_id=2)
    cart3 = Cart(user_id=3)
    cart4 = Cart(user_id=4)
    cart5 = Cart(user_id=5)
    cart6 = Cart(user_id=6)


    db.session.add_all([cart1, cart2, cart3, cart4, cart5, cart6])
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.

def undo_carts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.carts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM carts"))

    db.session.commit()
