from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired

class AddToCartForm(FlaskForm):
    cart_id = IntegerField('Cart ID', validators=[DataRequired()])
    opportunity_id = IntegerField('Opportunity ID', validators=[DataRequired()])
