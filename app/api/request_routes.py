from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user

request_routes = Blueprint('request', __name__)
