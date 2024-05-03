// import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { deleteReviewThunk } from "../../redux/reviews";
import "./DeleteReviews.css";

const DeleteReview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { closeModal } = useModal();
  const { reviewId, opportunityId } = useParams();
  console.log("OPPORTUNITy ID>>>", opportunityId);
  const onDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReviewThunk(reviewId)).then(() => {
      window.location.href = "/";
    });
  };

  // const onKeep = () => {
  //   closeModal;
  // };

  return (
    <>
      <div className="delete-review-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to remove your product review?</p>
        <button className="yes-delete-review" onClick={onDelete}>
          Delete Review
        </button>
        <button
          onClick={() => navigate(`/opportunities/${opportunityId}/reviews/`)}
        >
          {" "}
          Keep Review{" "}
        </button>
      </div>
    </>
  );
};

export default DeleteReview;
