from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Cart, Opportunity, Review, AddToCart
from .aws_routes import upload_file_to_s3, get_unique_filename
from app.forms import OpportunityForm, ReviewForm

opportunity_routes = Blueprint('opportunity', __name__)


# * Get all opportunities
@opportunity_routes.route('/')
def get_all_opportunities():
    opportunities = Opportunity.query.all()

    return jsonify({'opportunities': [opportunity.to_dict() for opportunity in opportunities]}), 200


# * Get unique opportunity
@opportunity_routes.route('/<int:id>')
def get_one_opportunity(id):
    opportunity = Opportunity.query.get(id)

    if not opportunity:
        return jsonify({'error': 'Opportunity was not found'}), 404

    return opportunity.to_dict(), 200


#* Get opps of user
@opportunity_routes.route('/manage')
@login_required
def owned_opportunities():
    opportunities = Opportunity.query.filter_by(user_id=current_user.id).all()
    opportunities_data = [opportunity.to_dict() for opportunity in opportunities]

    return jsonify({'opportunities': opportunities_data}), 200



# * Create opportunity
@opportunity_routes.route('/new', methods=['POST'])
@login_required
def create_listing():
    form = OpportunityForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        image = form.data['image_url']
        url = None

        if image:
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)

            if "url" not in upload:
                return jsonify({'error': 'Not a valid image, upload failed'}), 400

            url = upload['url']

        opportunity_listing = Opportunity(
            user_id=current_user.id,
            title=form.title.data,
            rate=form.rate.data,
            type=form.type.data,
            multiple_days=form.multiple_days.data,
            number_of_days=form.number_of_days.data,
            contact_information=form.contact_information.data,
            image=url,
            description=form.description.data
        )

        db.session.add(opportunity_listing)
        db.session.commit()

        return jsonify({'opportunity': opportunity_listing.to_dict()}), 201
    else:
        errors = form.errors
        return jsonify({'errors': errors}), 400


#* update opp
@opportunity_routes.route('/<int:id>/edit', methods=['PUT'])
@login_required
def edit_listing(id):
    opportunity = Opportunity.query.get(id)

    form = Opportunity()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if not opportunity:
        return jsonify({'error': 'Unable to locate opportunity'}), 404

    if opportunity.user_id != current_user.id:
        return jsonify({'error:' 'You are not authorized to make changes to this opportunity.'}), 403

    if form.validate_on_submit():
        if 'image_url' in request.files:
            # Handle image upload and update image URL
            upload_request = request.files['image_url']
            upload_request.filename = get_unique_filename(upload_request.filename)
            upload = upload_file_to_s3(upload_request)

            if 'url' not in upload:
                return jsonify({'error': 'Image upload failed.'}), 500
            opportunity.image = upload['url']

        # Update
        opportunity.title = form.title.data
        opportunity.rate = form.rate.data
        opportunity.type = form.type.data
        opportunity.description = form.description.data

        db.session.commit()

        return jsonify({"message": "Opportunity has been updated successfully."}), 200
    else:
        return jsonify({'errors': form.errors}), 400


#* Delete
@opportunity_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_listing(id):
    opportunity = Opportunity.query.get(id)

    if not opportunity:
        return jsonify({'error': 'Unable to locate opportunity'}), 404

    if opportunity.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to delete this opportunity.'}), 403

    db.session.delete(opportunity)
    db.session.commit()

    return jsonify({'message': 'Opportunity listing successfully deleted.'}), 200

# * Search by type
# @opportunity_routes.route('/types/<string:type>')
# def viewType(type):
#     orderOpps = Opportunity.query.filter(Opportunity.type == type).all()

#     if not orderOpps:
#         return jsonify({'error': 'No opportunities were found with your type.'}), 400

#     return jsonify({'opportunities': [opportunity.to_dict() for opportunity in orderOpps]}), 200




# * Get all reviews of opportunity
@opportunity_routes.route('/<int:id>/reviews/all')
def allReviewsById(id):
    opportunity = Opportunity.query.get(id)

    if not opportunity:
        return jsonify({'error': 'Opportunity not found'}), 404

    reviews = Review.query.filter_by(opportunity_id=id).all()
    reviews_data = [review.to_dict() for review in reviews]

    return jsonify({'reviews': reviews_data}), 200


# * Create a review for opportunity
@opportunity_routes.route('/<int:id>/reviews/new', methods=['POST'])
@login_required
def createReview(id):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']



    if form.validate_on_submit():

        new_review = Review(
            user_id=current_user.id,
            opportunity_id=id,
            rating=form.rating.data,
            # verified_booking=form.verified_booking.data,
            description=form.description.data
    )

        db.session.add(new_review)
        db.session.commit()

        return jsonify({'review': new_review.to_dict()}), 201
    else:
        errors = form.errors
        return jsonify({'errors': errors}), 400






# * Get Cart for user or create a cart
@opportunity_routes.route('/carts', methods=['GET', 'POST'])
@login_required
def get_cart():
    if request.method == 'GET':
        carts = Cart.query.filter_by(user_id=current_user.id).all()
        if not carts:
            return jsonify({'message': 'Cart not found for the current user.'}), 404

        # Fetch associated cart items with subtotal
        # cart_items = AddToCart.query.filter_by(cart_id=cart.id).all()

        # Serialize cart items and calculate subtotal
        serialized_cart = []
        subtotal = 0.00
        # for item in cart_items:
        #     subtotal += item.subtotal
        #     serialized_cart.append({
        #         'id': item.id,
        #         'cart_id': item.cart_id,
        #         'opportunity_id': item.opportunity_id,
        #         'quantity_added': item.quantity_added,
        #         'subtotal': item.subtotal,
        #         'created_at': item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        #         'updated_at': item.updated_at.strftime("%Y-%m-%d %H:%M:%S")
        #     })

        return jsonify({'cart_items': serialized_cart,
                        'carts': [cart.to_dict() for cart in carts]  }), 200


    elif request.method == 'POST':
        cart = Cart.query.filter_by(user_id=current_user.id).first()
        if not cart:
            new_cart = Cart(user_id=current_user.id)
            db.session.add(new_cart)
            db.session.commit()
            return jsonify({'message': 'New cart created for the current user.'}), 201
        return jsonify({'message': 'Cart already exists for the current user.'}), 200

# * Get all carts for user
@opportunity_routes.route('/carts/history')
@login_required
def cart_history():
    # Fetch all carts for the current user
    carts = Cart.query.filter_by(user_id=current_user.id).all()

    if not carts:
        return jsonify({'message': 'No carts found for the current user.'}), 404

    cart_history = []

    for cart in carts:
        cart_items = AddToCart.query.filter_by(cart_id=cart.id).all()

        # Serialize cart items and calculate subtotal
        total_cart = []
        subtotal = 0.00
        for item in cart_items:
            subtotal += item.subtotal
            total_cart.append({
                'id': item.id,
                'cart_id': item.cart_id,
                'opportunity_id': item.opportunity_id,
                'subtotal': item.subtotal,
                'created_at': item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                'updated_at': item.updated_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        # Add cart details to cart history
        cart_history.append(total_cart)

    return jsonify({'cart_history': cart_history}), 200


# * Adding to cart
@opportunity_routes.route('/cart/add_opportunity', methods=['POST'])
@login_required
def add_opportunity_to_cart():
    data = request.get_json()
    opportunity_id = data.get('opportunity_id')
    cart_id = data.get('cart_id')
    print("OPPORTUNITY ID & CART", cart_id)
    # quantity = data.get('quantity', 1)

    if not opportunity_id:
        return jsonify({'error': 'Opportunity ID is required.'}), 400

    opportunity = Opportunity.query.get(opportunity_id)
    if not opportunity:
        return jsonify({'error': 'Opportunity not found.'}), 404

    if opportunity.rate is None:
        return jsonify({'error': 'Rate is missing.'}), 400

    cart = Cart.query.get(cart_id)
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.session.add(cart)
        db.session.commit()

    subtotal = opportunity.rate
# to add multiple opps. I will need to iterate through a list of opportunities
# inside the for looop invoke addToCart class.
#  line 234 & 235 for every opp
    print("CART ID", cart_id)
    new_item = AddToCart(cart_id=cart_id, opportunity_id=opportunity_id, subtotal=subtotal)
    db.session.add(new_item)

    db.session.commit()

    return jsonify({'message': f'Opportunity successfully added to your cart.'}), 200

# * Updating cart and save for later
@opportunity_routes.route('/cart/update', methods=['PUT'])
@login_required
def update_cart():
    data = request.get_json()
    cart_items = data.get('cart_items')

    if not cart_items:
        return jsonify({'error': 'Cart items are required.'}), 400

    for cart_item in cart_items:
        cart_id = cart_item.get('cart_id')
        opportunity_id = cart_item.get('opportunity_id')
        quantity = cart_item.get('quantity')

        if not cart_id or not opportunity_id:
            return jsonify({'error': 'Both cart ID and opportunity ID are required.'}), 400

        cart_item_record = AddToCart.query.filter_by(cart_id=cart_id, opportunity_id=opportunity_id).first()
        if not cart_item_record:
            return jsonify({'error': f'Cart item with opportunity ID {opportunity_id} not found.'}), 404

        if quantity is not None:
            if not isinstance(quantity, int) or quantity < 0:
                return jsonify({'error': 'Invalid quantity.'}), 400
            cart_item_record.quantity_added = quantity

            opportunity = Opportunity.query.get(opportunity_id)
            if opportunity:
                cart_item_record.subtotal = opportunity.rate
            else:
                return jsonify({'error': f'Opportunity with ID {opportunity_id} not found.'}), 404

    db.session.commit()
    return jsonify({'message': 'Cart updated successfully.'}), 200


# * Deleting items from cart
@opportunity_routes.route('/cart/remove/<int:cartItemId>', methods=['DELETE'])
@login_required
def remove_from_cart(cartItemId):
    cart_item = AddToCart.query.get(cartItemId)

    if not cart_item:
        return jsonify({'error': 'Cart item not found.'}), 404

    cart = Cart.query.filter(Cart.id == cart_item.cart_id).first()

    if cart.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access to cart item.'}), 403

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({'message': 'Cart item deleted successfully.'}), 200
