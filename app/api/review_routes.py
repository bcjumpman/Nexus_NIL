from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Review
from app.forms import ReviewForm

review_routes = Blueprint('review', __name__)


# * Get review by id
@review_routes.route('/<int:id>')
@login_required
def get_review(id):
    review = Review.query.get(id)

    if not review:
        return jsonify({'error': 'Review was not found.'}), 404

    return review.to_dict(), 200

# * Edit review
@review_routes.route('/<int:id>/edit', methods=['PUT'])
@login_required
def update_one_review(id):
    review = Review.query.get(id)

    form = ReviewForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if not review:
        return jsonify({'error': 'Review was not found.'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to edit this review.'}), 403

    if form.validate_on_submit():

        review.rating = form.rating.data
        review.description = form.description.data

        db.session.commit()
        return jsonify({"message": 'Review updated successfully.'}), 200
    else:
        return jsonify({'errors': form.errors}), 400


# * Delete review
@review_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    review = Review.query.get(id)

    if not review:
        return jsonify({'error': 'Review was not found.'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to delete this review.'}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Successfully deleted review.'}), 200
