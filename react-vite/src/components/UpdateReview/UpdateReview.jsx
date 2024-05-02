import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getReviewById } from "../../redux/reviews";
import CreateNewReview from "../ReviewForm/ReviewForm";

const UpdateReview = () => {
  const dispatch = useDispatch();
  const { reviewId } = useParams();
  const reviews = useSelector((state) => state?.reviews.reviews);
  const review = reviews.find((review) => review.id === +reviewId);
  console.log("review>>>", reviews);

  useEffect(() => {
    dispatch(getReviewById(reviewId));
  }, [reviewId, dispatch]);

  const buttonName = "Update Review";

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Update your Review</h1>
      <div className="update-review-container">
        <CreateNewReview updatingReview={review} buttonName={buttonName} />
      </div>
    </>
  );
};

export default UpdateReview;
