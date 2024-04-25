from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user

order_routes = Blueprint('order', __name__)
