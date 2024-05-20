import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk } from "../../redux/session";
import { allReviewsOnOneOpportunityThunk } from "../../redux/reviews";
import { getOneOpportunityThunk } from "../../redux/opportunities";
import { addToCartThunk } from "../../redux/addtocart";
import "./OpportunityDetails.css";

const OpportunityDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { opportunityId } = useParams();
  const opportunity = useSelector((state) => state.opportunities.opportunity);
  const allReviews = useSelector((state) => state.reviews.reviews || []);
  // const allUsers = useSelector((state) => state.session.users || []);
  const userCart = useSelector((state) => state?.carts?.cart_items);
  const currentUser = useSelector((state) => state?.session?.user);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      await dispatch(getAllUsersThunk());
      await dispatch(getOneOpportunityThunk(opportunityId));
      await dispatch(allReviewsOnOneOpportunityThunk(opportunityId));
      setIsLoading(false);
    }
    fetchDetails();
  }, [dispatch, opportunityId]);

  useEffect(() => {
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((acc, curr) => {
        return acc + curr.rating;
      }, 0);
      const avgRating = totalRating / allReviews.length;
      setAverageRating(avgRating);
    }
  }, [allReviews]);

  const handleAddToCart = (opportunityId) => {
    dispatch(addToCartThunk(userCart?.id, opportunityId)).then(() => {
      setReload(!reload);
    });
    window.location.href = "/carts";
  };

  const handleUpdateReview = () => {
    if (userReview) {
      window.location.href = `/reviews/${userReview.id}/edit`;
    }
    setReload(true);
  };

  const handleDeleteReview = () => {
    window.location.href = `/reviews/${userReview.id}/delete`;
    setReload(true);
  };

  const dateFormatter = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStarIcons = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "star-filled" : "star-empty"}>
        {i < rating ? "★" : "☆"}
      </span>
    ));
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!opportunity) {
    return <p>No opportunity details available.</p>;
  }

  const userReview = allReviews.find(
    (review) => review.user_id === currentUser?.id
  );

  const relatedReviews = allReviews.filter(
    (review) => review.opportunity_id?.toString() === opportunityId
  );

  return (
    <div className="opportunity-details-container">
      <h1>{opportunity.title}</h1>
      <img
        className="opportunity-detail-image"
        src={opportunity.image}
        alt={opportunity.title}
      />
      <p className="opportunity-detail-rate">Rate: ${opportunity.rate}</p>
      <p>Type: {opportunity.type}</p>
      <p className="opportunity-detail-description">
        {opportunity.description}
      </p>
      <div className="average-rating-container">
        {renderStarIcons(Math.round(averageRating))}
        <button
          className="add-to-cart-button"
          onClick={() => handleAddToCart(opportunity.id)}
        >
          Add to Cart
        </button>
      </div>
      {userReview ? (
        <>
          <button
            className="edit-review"
            // onClick={() => handleUpdateReview(`/reviews/${userReview.id}/edit`)}
            onClick={() => handleUpdateReview(userReview.id)}
          >
            Edit your Review
          </button>
          <button onClick={() => handleDeleteReview(userReview.id)}>
            Delete your Review
          </button>
        </>
      ) : (
        <button
          className="delete-review"
          onClick={() =>
            navigate(`/opportunities/${opportunityId}/reviews/new`)
          }
        >
          Add a Review
        </button>
      )}
      {relatedReviews.map((review) => (
        <div key={review.id} className="review-container">
          {/* <p className="review-user">
            {allUsers.find((user) => user.id === review.user_id)?.first_name ||
              "Unknown"}{" "}
            reviewed:
          </p> */}
          <p className="review-rating">{renderStarIcons(review.rating)}</p>
          <p className="review-body">{review.description}</p>
          {/* <p className="review-verified-purchase">
            Verified Booking: {review.verified_booing ? "Yes" : "No"}
          </p> */}
          <p className="review-post-date">{dateFormatter(review.updated_at)}</p>
        </div>
      ))}
    </div>
  );
};

export default OpportunityDetailsPage;
