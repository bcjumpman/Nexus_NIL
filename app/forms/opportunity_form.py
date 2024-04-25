from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, TextAreaField
from wtforms.validators import DataRequired, NumberRange, Length, Optional

class OpportunityForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=100)])
    rate = FloatField('Rate', validators=[DataRequired(), NumberRange(min=0)])
    type = StringField('Type', validators=[DataRequired(), Length(max=50)])
    description = TextAreaField('Description', validators=[Optional(), Length(max=500)])
