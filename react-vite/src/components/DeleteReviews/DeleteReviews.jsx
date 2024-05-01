import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteReviewThunk } from "../../redux/reviews";
import "./DeleteReviews.css";

const DeleteReview = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { reviewId } = useParams();

  const onDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReviewThunk(reviewId)).then(() => {
      window.location.href = "/";
    });
  };

  const onKeep = () => {
    closeModal();
  };

  return (
    <>
      <div className="delete-review-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to remove your product review?</p>
        <button className="yes-delete-review" onClick={onDelete}>
          Yes (Delete Review)
        </button>
        <button onClick={onKeep}>No (Keep Review)</button>
      </div>
    </>
  );
};

export default DeleteReview;
