import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createReviewThunk,
  allReviewsOnOneOpportunityThunk,
  updateReviewThunk,
} from "../../redux/reviews";

const CreateNewReview = ({ buttonName, updatingReview }) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { opportunityId, reviewId } = useParams();
  const user = useSelector((state) => state.session.user);
  const review = useSelector((state) => state.reviews);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(null);
  const [verified_purchase, setVerified] = useState(false);
  const [validations, setValidations] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (updatingReview) {
      setDescription(updatingReview?.description);
      setRating(updatingReview?.rating);
      setVerified(updatingReview?.verified_purchase);
    }
    dispatch(allReviewsOnOneOpportunityThunk(updatingReview));
  }, [updatingReview, dispatch]);

  useEffect(() => {
    if (!user) nav("/");
  }, [user, submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("rating", parseInt(rating));
    formData.append("description", description);
    formData.append("verified_purchase", verified_purchase);

    setSubmitted(true);

    if (description.length <= 10 || rating < 1) {
      setValidations({ ...validations });
      return;
    }

    if (!reviewId) {
      await dispatch(createReviewThunk(opportunityId, formData));
    } else {
      await dispatch(updateReviewThunk(reviewId, formData));
    }

    nav(`/opportunities/${opportunityId || review?.opportunity_id}`);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="create-update-review-form"
      >
        {submitted && validations && validations.message && (
          <p>{validations.message}</p>
        )}
        <div className="star-rating-field">
          {[1, 2, 3, 4, 5].map((star, i) => {
            const starRating = i + 1;
            return (
              <label key={i}>
                <span
                  className="star-rating"
                  onClick={() => setRating(starRating)}
                  onMouseEnter={() => setHover(starRating)}
                  onMouseLeave={() => setHover(null)}
                >
                  {starRating <= (hover || rating) ? "★" : "☆"}
                </span>
              </label>
            );
          })}
        </div>
        <textarea
          className="description-textarea"
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Leave a review message here..."
          rows={7}
          cols={70}
        />
        {submitted && description.length <= 10 && (
          <p style={{ color: "red" }}>
            Your review must be greater than 10 characters.
          </p>
        )}
        {submitted && rating < 1 && (
          <p style={{ color: "red" }}>
            Please select a star rating along with your review.
          </p>
        )}
        <div className="Review-Btn-container">
          <button
            type="submit"
            className="Review-Submit-btn"
            disabled={
              submitted &&
              (description.length <= 10 || rating < 1 || validations)
            }
          >
            {buttonName}
          </button>
          <button
            className="back-to-opportunity"
            onClick={() =>
              (window.location.href = `/opportunities/${
                opportunityId || review?.opportunity_id
              }`)
            }
          >
            Back to Opportunity
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateNewReview;
