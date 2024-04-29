from flask_wtf import FlaskForm
from wtforms import IntegerField, SelectField
from wtforms.validators import DataRequired

class OrderForm(FlaskForm):
    cart_id = IntegerField('Cart ID', validators=[DataRequired()])
    user_id = IntegerField('User ID', validators=[DataRequired()])
    status_choices = [('PENDING', 'Pending'), ('ACCEPTED', 'Accepted'), ('REJECTED', 'Rejected')]
    status = SelectField('Status', choices=status_choices, validators=[DataRequired()])
