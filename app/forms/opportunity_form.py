from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, FloatField, TextAreaField, BooleanField
from flask_wtf.file import FileField, FileAllowed
from ..api.aws_routes import ALLOWED_EXTENSIONS
from wtforms.validators import DataRequired, NumberRange, Length, Optional

class OpportunityForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=100)])
    rate = FloatField('Rate', validators=[DataRequired(), NumberRange(min=0)])
    type = StringField('Type', validators=[Optional(), Length(max=50)])
    image = FileField("Profile Picture", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    description = TextAreaField('Description', validators=[Optional(), Length(max=500)])
    multiple_days = BooleanField('Multiple Day Booking', validators=[Optional()])
    number_of_days = IntegerField('How Many Days', validators=[Optional()])
    contact_information = TextAreaField('Contact Information', validators=[Optional()])
