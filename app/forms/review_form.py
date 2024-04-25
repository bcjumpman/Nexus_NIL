from flask_wtf import FlaskForm
from wtforms import IntegerField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, NumberRange, Length

class ReviewForm(FlaskForm):
    rating = IntegerField('Rating', validators=[DataRequired(), NumberRange(min=1, max=5)])
    verified_booking = BooleanField('Verified Booking')
    description = TextAreaField('Description', validators=[DataRequired(), Length(max=500)])
