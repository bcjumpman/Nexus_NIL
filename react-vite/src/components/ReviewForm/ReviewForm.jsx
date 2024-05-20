import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createReviewThunk, updateReviewThunk } from "../../redux/reviews";
import "./ReviewForm.css";

const CreateNewReview = ({ buttonName, updatingReview }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { opportunityId, reviewId } = useParams();
  // const user = useSelector((state) => state.session.user);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(null);
  const [verifiedBooking, setVerifiedBooking] = useState(false);
  const [validations, setValidations] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (updatingReview) {
      setDescription(updatingReview.description);
      setRating(updatingReview.rating);
      setVerifiedBooking(updatingReview.verified_booking);
    }
  }, [updatingReview]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (description.length <= 10 || rating < 0) {
      setValidations({
        message: "Please ensure description and stars are filled.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("description", description);
    formData.append("verified_booking", verifiedBooking);

    const action = reviewId
      ? updateReviewThunk(reviewId, formData)
      : createReviewThunk(opportunityId, formData);

    try {
      const result = await dispatch(action);
      if (result.error) {
        setValidations({ message: result.error });
      } else {
        if (reviewId)
          navigate(`/opportunities/${updatingReview.opportunity_id}`);
        else {
          navigate(`/opportunities/${opportunityId}`);
        }
      }
    } catch (error) {
      setValidations({
        message:
          error.message || "An error occurred during the submission process.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-update-review-form">
      {submitted && validations.message && <p>{validations.message}</p>}
      <div className="star-rating-field">
        {[1, 2, 3, 4, 5].map((star, i) => (
          <label key={i}>
            <span
              className={`star-rating ${
                star <= (hover || rating) ? "star-filled" : "star-empty"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            >
              {i < rating ? "★" : "☆"}
            </span>
          </label>
        ))}
      </div>
      <textarea
        className="description-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Leave a review message here..."
        rows={7}
        cols={70}
      />
      {/* <button
        type="button"
        className={`verified-button ${
          verifiedBooking ? "verified" : "not-verified"
        }`}
        onClick={() => setVerifiedBooking(!verifiedBooking)}
      >
        {verifiedBooking ? "Verified Booking" : "Mark as Verified"}
      </button> */}
      <button type="submit" className="submit-button">
        {buttonName}
      </button>
      <button
        type="button"
        className="back-to-opportunity"
        onClick={() => navigate(`/opportunities/${opportunityId}`)}
      >
        Back to Opportunity
      </button>
    </form>
  );
};

export default CreateNewReview;
