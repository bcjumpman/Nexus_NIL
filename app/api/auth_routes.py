# from flask import Blueprint, request, abort, redirect
# from app.models import User, db
# from app.forms import LoginForm
# from app.forms import SignUpForm
# from flask_login import current_user, login_user, logout_user, login_required


# import os
# import json
# import requests

# from google.oauth2 import id_token
# import google_auth_oauthlib
# from pip._vendor import cachecontrol
# import google.auth.transport.requests
# from tempfile import NamedTemporaryFile
# from google_auth_oauthlib.flow import Flow
# from oauth2 import oauth2_session



# auth_routes = Blueprint('auth', __name__)

# ### OAUTH 2.0 SETUP ###
# # Note: As the flow object requires a file path to load the configuration from AND
# #	we want to keep our credentials safe (out of our github repo!!).
# #	We will create a temporary file to hold our values as json.
# #	Some of these values will come from our .env file.

# # Import our credentials from the .env file
# CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
# CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
# BASE_URL = os.getenv('BASE_URL')

# client_secrets = {
#   "web": {
#     "client_id": CLIENT_ID,
#     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#     "token_uri": "https://oauth2.googleapis.com/token",
#     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
#     "client_secret": CLIENT_SECRET,
#     "redirect_uris": [
#       "http://localhost:8000/api/auth/callback"
#     ]
#   }
# }

# # Here we are generating a temporary file as the google oauth package requires a file for configuration!
# secrets = NamedTemporaryFile()
# # Note that the property '.name' is the file PATH to our temporary file!
# # The command below will write our dictionary to the temp file AS json!
# with open(secrets.name, "w") as output:
#     json.dump(client_secrets, output)

# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # to allow Http traffic for local dev

# flow = Flow.from_client_secrets_file(
#     client_secrets_file=secrets.name,
#     scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
#     redirect_uri="http://localhost:8000/api/auth/callback"
# )

# secrets.close() # This method call deletes our temporary file from the /tmp folder! We no longer need it as our flow object has been configured!


# """
# Initializing our flow class below, note that there is a parameter named 'autogenerate_code_verifier'
# which is not shown as it has a default value of True, which is preceisely what we want.
# As a result, our flow class constructor will generate a code verifier for us and transmit it in
# URL parameters of the first redirect in our OAuth flow.
# """
# flow = google_auth_oauthlib.flow.Flow(
#     oauth2_session,
#     client_type='web',
#     client_config=client_config,
#     redirect_uri=redirect_uri,
# )
# @auth_routes.route('/')
# def authenticate():
#     """
#     Authenticates a user.
#     """
#     if current_user.is_authenticated:
#         return current_user.to_dict()
#     return {'errors': {'message': 'Unauthorized'}}, 401


# @auth_routes.route('/login', methods=['POST'])
# def login():
#     """
#     Logs a user in
#     """
#     form = LoginForm()
#     # Get the csrf_token from the request cookie and put it into the
#     # form manually to validate_on_submit can be used
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         # Add the user to the session, we are logged in!
#         user = User.query.filter(User.email == form.data['email']).first()
#         login_user(user)
#         return user.to_dict()
#     return form.errors, 401


# @auth_routes.route('/logout')
# def logout():
#     """
#     Logs a user out
#     """
#     logout_user()
#     return {'message': 'User logged out'}


# @auth_routes.route('/signup', methods=['POST'])
# def sign_up():
#     """
#     Creates a new user and logs them in
#     """
#     form = SignUpForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         user = User(
#             username=form.data['username'],
#             email=form.data['email'],
#             first_name =form.data['first_name'],
#             last_name =form.data['last_name'],
#             password=form.data['password']
#         )
#         db.session.add(user)
#         db.session.commit()


#         login_user(user)
#         return user.to_dict()
#     return form.errors, 401


# @auth_routes.route('/unauthorized')
# def unauthorized():
#     """
#     Returns unauthorized JSON when flask-login authentication fails
#     """
#     return {'errors': {'message': 'Unauthorized'}}, 401

# # OAuth flow initiating endpoint.
# @auth_routes.route("/oauth_login")
# def oauth_login():
#     authorization_url, state = flow.authorization_url(prompt="select_account consent")
#     print("AUTH URL: ", authorization_url) # I recommend that you print this value out to see what it's generating.
#     # Ex: https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=NICE TRY&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&state=A0eZyFD4WH6AfqSj7XcdypQ0cMhwr9&access_type=offline
#     # It SHOULD look a lot like the URL in the SECOND or THIRD line of our flow chart!
#     # Note that in the auth url above the value 'access_type' is set to 'offline'. If you do not send this, the user will NOT see the Google Login screen!!
#     # Additionally, note that this URL does NOT contain the 'code_challenge_method' value NOR the 'code_challenge' that can be seen in our flow chart.
#     # This package may have been created BEFORE the official Oauth2 consortium began recommending PKCE even for back channel flows...
#     # While implementation details are completely obscured by the method .authorization_url() let's note 2 things here.
#     # 1) We ARE generating a random value for the 'state' variable. We save it to the session on the line below to compare later.
#     # 2) The authorization URL
#     referrer = request.headers.get('Referer') # The Referer Header will contain the URL from which the GET was sent! We can use this in our final redirect to navigate the user back to that page!
#     session["referrer"] = referrer
#     session["state"] = state
#     return redirect(authorization_url) # This line technically will enact the SECOND and THIRD lines of our flow chart.

# #  Second Endpoint (Our callback as defined in the GCP Console. The Redirect_uri):

# @auth_routes.route("/callback")
# def callback():
#     flow.fetch_token(authorization_response=request.url) # This method is sending the request depicted on line 6 of our flow chart! The response is depicted on line 7 of our flow chart.
#     # I find it odd that the author of this code is verifying the 'state' AFTER requesting a token, but to each their own!!

#     # This is our CSRF protection for the Oauth Flow!
#     if not session["state"] == request.args["state"]:
#         abort(500)  # State does not match!

#     credentials = flow.credentials
#     request_session = requests.session()
#     cached_session = cachecontrol.CacheControl(request_session)
#     token_request = google.auth.transport.requests.Request(session=cached_session)

#     # The method call below will go through the tedious work of verifying the JWT signature sent back with the object from OpenID Connect
#     # Although I cannot verify, hopefully it is also testing the values for "sub", "aud", "iat", and "exp" sent back in the CLAIMS section of the JWT
#     # Additionally note, that the oauth initializing URL generated in the previous endpoint DID NOT send a random nonce value. (As depicted in our flow chart)
#     # If it had, the server would return the nonce in the JWT claims to be used for further verification tests!
#     id_info = id_token.verify_oauth2_token(
#         id_token=credentials._id_token,
#         request=token_request,
#         audience=CLIENT_ID
#     )

#     # Now we generate a new session for the newly authenticated user!!
#     # Note that depending on the way your app behaves, you may be creating a new user at this point...
#     temp_email = id_info.get('email')

#     user_exists = User.query.filter(User.email == temp_email).first()

#     if not user_exists:
#         user_exists = User(
#             username=id_info.get("name"),
#             email=temp_email,
#             password='OAUTH'
#         )

#         db.session.add(user_exists)
#         db.session.commit()

#     login_user(user_exists)

#     return redirect(session['referrer']) # This will send the final redirect to our user's browser. As depicted in Line 8 of the flow chart!


# from flask import Blueprint, request, abort, redirect, session
# from app.models import User, db
# from app.forms import LoginForm, SignUpForm
# from flask_login import current_user, login_user, logout_user, login_required

# import os
# import json
# import requests

# from google.oauth2 import id_token
# import google_auth_oauthlib
# from pip._vendor import cachecontrol
# import google.auth.transport.requests
# from tempfile import NamedTemporaryFile
# from google_auth_oauthlib.flow import Flow

# auth_routes = Blueprint('auth', __name__)

# # Import our credentials from the .env file
# CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
# CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
# BASE_URL = os.getenv('BASE_URL')

# client_secrets = {
#   "web": {
#     "client_id": CLIENT_ID,
#     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#     "token_uri": "https://oauth2.googleapis.com/token",
#     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
#     "client_secret": CLIENT_SECRET,
#     "redirect_uris": [
#       "http://localhost:8000/api/auth/callback"
#     ]
#   }
# }

# # Creating a temporary file for google oauth configuration
# with NamedTemporaryFile(delete=False, mode='w') as secrets:
#     json.dump(client_secrets, secrets)
#     secrets_path = secrets.name

# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # Allow HTTP traffic for local dev

# flow = Flow.from_client_secrets_file(
#     client_secrets_file=secrets_path,
#     scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
#     redirect_uri="http://localhost:8000/api/auth/callback"
# )

# @auth_routes.route('/')
# def authenticate():
#     if current_user.is_authenticated:
#         return current_user.to_dict()
#     return {'errors': {'message': 'Unauthorized'}}, 401

# @auth_routes.route('/login', methods=['POST'])
# def login():
#     form = LoginForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         user = User.query.filter(User.email == form.data['email']).first()
#         login_user(user)
#         return user.to_dict()
#     return form.errors, 401

# @auth_routes.route('/logout')
# def logout():
#     logout_user()
#     return {'message': 'User logged out'}

# @auth_routes.route('/signup', methods=['POST'])
# def sign_up():
#     form = SignUpForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         user = User(
#             username=form.data['username'],
#             email=form.data['email'],
#             first_name=form.data['first_name'],
#             last_name=form.data['last_name'],
#             password=form.data['password']
#         )
#         db.session.add(user)
#         db.session.commit()
#         login_user(user)
#         return user.to_dict()
#     return form.errors, 401

# @auth_routes.route('/unauthorized')
# def unauthorized():
#     return {'errors': {'message': 'Unauthorized'}}, 401

# @auth_routes.route("/oauth_login")
# def oauth_login():
#     authorization_url, state = flow.authorization_url(prompt="select_account consent")
#     session["state"] = state
#     return redirect(authorization_url)

# @auth_routes.route("/callback")
# def callback():
#     flow.fetch_token(authorization_response=request.url)
#     if not session["state"] == request.args["state"]:
#         abort(500)  # State does not match!

#     credentials = flow.credentials
#     request_session = requests.session()
#     cached_session = cachecontrol.CacheControl(request_session)
#     token_request = google.auth.transport.requests.Request(session=cached_session)

#     id_info = id_token.verify_oauth2_token(
#         id_token=credentials._id_token,
#         request=token_request,
#         audience=CLIENT_ID
#     )

#     temp_email = id_info.get('email')
#     user_exists = User.query.filter(User.email == temp_email).first()

#     if not user_exists:
#         user_exists = User(
#             username=id_info.get("name"),
#             email=temp_email,
#             password='OAUTH'
#         )
#         db.session.add(user_exists)
#         db.session.commit()

#     login_user(user_exists)
#     return redirect("/")  # Change this to where you want to redirect the user after login


import os
import json
import requests

from flask import Blueprint, request, abort, redirect, session
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

from google.oauth2 import id_token
import google_auth_oauthlib
from pip._vendor import cachecontrol
import google.auth.transport.requests
from tempfile import NamedTemporaryFile
from google_auth_oauthlib.flow import Flow

auth_routes = Blueprint('auth', __name__)

# Import our credentials from the .env file
CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
BASE_URL = os.getenv('BASE_URL')

# Debugging: Print client ID and secret to ensure they are loaded correctly
print(f"Client ID: {CLIENT_ID}")
print(f"Client Secret: {CLIENT_SECRET}")

environment = os.getenv("FLASK_ENV")
redirect_uri = "https://nexus-nil-5lqm.onrender.com/api/auth/callback" if environment == "production" else "http://localhost:8000/api/auth/callback"


client_secrets = {
  "web": {
    "client_id": CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": CLIENT_SECRET,
    "redirect_uris": [
      "http://localhost:8000/api/auth/callback"
    ]
  }
}

# Creating a temporary file for google oauth configuration
with NamedTemporaryFile(delete=False, mode='w') as secrets:
    json.dump(client_secrets, secrets)
    secrets_path = secrets.name

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # Allow HTTP traffic for local dev

flow = Flow.from_client_secrets_file(
    client_secrets_file=secrets_path,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:8000/api/auth/callback"
)

@auth_routes.route('/')
def authenticate():
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401

@auth_routes.route('/login', methods=['POST'])
def login():
    form = LoginForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401

@auth_routes.route('/logout')
def logout():
    logout_user()
    return {'message': 'User logged out'}

@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            first_name=form.data['first_name'],
            last_name=form.data['last_name'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return form.errors, 401

@auth_routes.route('/unauthorized')
def unauthorized():
    return {'errors': {'message': 'Unauthorized'}}, 401

@auth_routes.route("/oauth_login")
def oauth_login():
    authorization_url, state = flow.authorization_url(prompt="select_account consent")
    print("AUTH URL: ", authorization_url)  # Debugging: Print the authorization URL
    session["state"] = state
    return redirect(authorization_url)

@auth_routes.route("/callback")
def callback():
    try:
        print(f"Callback URL: {request.url}")  # Debugging: Print the callback URL
        flow.fetch_token(authorization_response=request.url)
    except Exception as e:
        print(f"Error during token fetch: {e}")  # Debugging: Print the error
        abort(500)

    if not session["state"] == request.args["state"]:
        print("State mismatch error")
        abort(500)  # State does not match!

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    try:
        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token,
            request=token_request,
            audience=CLIENT_ID
        )
    except Exception as e:
        print(f"Error during token verification: {e}")
        abort(500)

    temp_email = id_info.get('email')
    user_exists = User.query.filter(User.email == temp_email).first()

    if not user_exists:
        try:
            user_exists = User(
                username=id_info.get("name"),
                email=temp_email,
                password='OAUTH'
            )
            db.session.add(user_exists)
            db.session.commit()
        except Exception as e:
            print(f"Error during user creation: {e}")
            abort(500)

    login_user(user_exists)
    return redirect(session['referrer']) # This will send the final redirect to our user's browser. As depicted in Line 8 of the flow chart!
