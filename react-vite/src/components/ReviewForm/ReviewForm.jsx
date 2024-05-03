// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createReviewThunk,
//   allReviewsOnOneOpportunityThunk,
//   updateReviewThunk,
// } from "../../redux/reviews";

// const CreateNewReview = ({ buttonName, updatingReview }) => {
//   const dispatch = useDispatch();
//   const nav = useNavigate();
//   const { opportunityId, reviewId } = useParams();
//   const user = useSelector((state) => state.session.user);
//   const review = useSelector((state) => state.reviews);
//   const [description, setDescription] = useState("");
//   const [rating, setRating] = useState(null);
//   const [verified_booking, setVerified] = useState(false);
//   const [validations, setValidations] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [hover, setHover] = useState(null);

//   useEffect(() => {
//     if (updatingReview) {
//       setDescription(updatingReview?.description);
//       setRating(updatingReview?.rating);
//       setVerified(updatingReview?.verified_booking);
//     }
//     dispatch(allReviewsOnOneOpportunityThunk(updatingReview));
//   }, [updatingReview, dispatch]);

//   useEffect(() => {
//     if (!user) nav("/");
//   }, [user, submitted]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("rating", parseInt(rating));
//     formData.append("description", description);
//     formData.append("verified_booking", verified_booking);

//     setSubmitted(true);

//     if (description.length <= 10 || rating < 1) {
//       setValidations({ ...validations });
//       return;
//     }

//     if (!reviewId) {
//       await dispatch(createReviewThunk(opportunityId, formData));
//     } else {
//       await dispatch(updateReviewThunk(reviewId, formData));
//     }

//     nav(`/opportunities/${opportunityId || review?.opportunity_id}`);
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit}
//         encType="multipart/form-data"
//         className="create-update-review-form"
//       >
//         {submitted && validations && validations.message && (
//           <p>{validations.message}</p>
//         )}
//         <div className="star-rating-field">
//           {[1, 2, 3, 4, 5].map((star, i) => {
//             const starRating = i + 1;
//             return (
//               <label key={i}>
//                 <span
//                   className="star-rating"
//                   onClick={() => setRating(starRating)}
//                   onMouseEnter={() => setHover(starRating)}
//                   onMouseLeave={() => setHover(null)}
//                 >
//                   {starRating <= (hover || rating) ? "★" : "☆"}
//                 </span>
//               </label>
//             );
//           })}
//         </div>
//         <textarea
//           className="description-textarea"
//           type="text"
//           name="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Leave a review message here..."
//           rows={7}
//           cols={70}
//         />
//         <button
//           className="verified-button"
//           type="boolean"
//           name="verified booking"
//         >
//           BOOKED?
//         </button>
//         {submitted && description.length <= 10 && (
//           <p style={{ color: "red" }}>
//             Your review must be greater than 10 characters.
//           </p>
//         )}
//         {submitted && rating < 1 && (
//           <p style={{ color: "red" }}>
//             Please select a star rating along with your review.
//           </p>
//         )}
// <div className="Review-Btn-container">
//   {/* <button
//     type="submit"
//     className="Review-Submit-btn"
//     disabled={
//       submitted &&
//       (description.length <= 10 || rating < 1 || validations)
//     }
//   > */}
//   {
//     <button type="submit" className="submit-button">
//       {buttonName}
//     </button>
//   }
//   {/* {buttonName} */}
//   <button
//     className="back-to-opportunity"
//     onClick={() =>
//       (window.location.href = `/opportunities/${
//         opportunityId || review?.opportunity_id
//       }`)
//     }
//   >
//     Back to Opportunity
//   </button>
// </div>
//       </form>
//     </>
//   );
// };

// export default CreateNewReview;

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createReviewThunk,
//   allReviewsOnOneOpportunityThunk,
//   updateReviewThunk,
// } from "../../redux/reviews";

// const CreateNewReview = ({ buttonName, updatingReview }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { opportunityId, reviewId } = useParams();
//   const user = useSelector((state) => state.session.user);
//   const [description, setDescription] = useState("");
//   const [rating, setRating] = useState(null);
//   const [verifiedBooking, setVerifiedBooking] = useState(false);
//   const [validations, setValidations] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [hover, setHover] = useState(null);

//   useEffect(() => {
//     if (updatingReview) {
//       setDescription(updatingReview.description || "");
//       setRating(updatingReview.rating || null);
//       setVerifiedBooking(updatingReview.verified_booking || false);
//     }
//   }, [updatingReview]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("rating", rating);
//     formData.append("description", description);
//     formData.append("verified_booking", verifiedBooking);

//     if (description.length <= 10 || rating < 1) {
//       setValidations({ message: "Validation errors here." });
//       return;
//     }

//     const action = reviewId
//       ? updateReviewThunk(reviewId, formData)
//       : createReviewThunk(opportunityId, formData);

//     await dispatch(action);
//     navigate(`/opportunities/${opportunityId}`);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="create-update-review-form">
//       {submitted && validations.message && <p>{validations.message}</p>}
//       <div className="star-rating-field">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <label key={star}>
//             <span
//               className={`star-rating ${
//                 star <= (hover || rating) ? "star-filled" : "star-empty"
//               }`}
//               onClick={() => setRating(star)}
//               onMouseEnter={() => setHover(star)}
//               onMouseLeave={() => setHover(null)}
//             >
//               ★
//             </span>
//           </label>
//         ))}
//       </div>
//       <textarea
//         className="description-textarea"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Leave a review message here..."
//         rows={7}
//         cols={70}
//       />
//       {submitted && description.length <= 10 && (
//         <p style={{ color: "red" }}>
//           Your review must be greater than 10 characters.
//         </p>
//       )}
//       {submitted && rating < 1 && (
//         <p style={{ color: "red" }}>
//           Please select a star rating along with your review.
//         </p>
//       )}
//       <button
//         type="button"
//         className={`verified-button ${
//           verifiedBooking ? "verified" : "not-verified"
//         }`}
//         onClick={() => setVerifiedBooking(!verifiedBooking)}
//       >
//         {verifiedBooking ? "Verified Booking" : "Mark as Verified"}
//       </button>
//       <button type="submit" className="submit-button">
//         {buttonName}
//       </button>
//       <button
//         type="button"
//         className="back-to-opportunity"
//         onClick={() => navigate(`/opportunities/${opportunityId}`)}
//       >
//         Back to Opportunity
//       </button>
//     </form>
//   );
// };

// export default CreateNewReview;

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createReviewThunk, updateReviewThunk } from "../../redux/reviews";

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

  console.log("OPPORTUNITY ID>>>>", opportunityId);
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
        message: "Please ensure all fields are correctly filled.",
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
      // console.log("RESULT>>>", result);
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
      <button
        type="button"
        className={`verified-button ${
          verifiedBooking ? "verified" : "not-verified"
        }`}
        onClick={() => setVerifiedBooking(!verifiedBooking)}
      >
        {verifiedBooking ? "Verified Booking" : "Mark as Verified"}
      </button>
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
