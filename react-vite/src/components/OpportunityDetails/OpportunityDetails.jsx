// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllUsersThunk } from "../../redux/session";
// import {
//   deleteReviewThunk,
//   updateReviewThunk,
//   allReviewsOnOneOpportunityThunk,
// } from "../../redux/reviews";
// import { getOneOpportunityThunk } from "../../redux/opportunities";

// const OpportunityDetailsPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { opportunityId } = useParams();
//   const opportunity = useSelector((state) => state.opportunities.opportunity);
//   //   const allReviews = useSelector((state) => state.reviews.reviews || []);
//   const allReviews = useSelector((state) => {
//     // console.log(state); // This will show you the current shape of the state
//     return state.reviews.reviews || [];
//   });
//   const allUsers = useSelector((state) => state.session.users || []);
//   const currentUser = useSelector((state) => state.session.user);

//   const [averageRating, setAverageRating] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function fetchDetails() {
//       setIsLoading(true);
//       dispatch(getAllUsersThunk());
//       dispatch(getOneOpportunityThunk(opportunityId));
//       dispatch(allReviewsOnOneOpportunityThunk(opportunityId));
//       setIsLoading(false);
//     }
//     fetchDetails();
//   }, [dispatch, opportunityId]);

//   useEffect(() => {
//     if (allReviews.length > 0) {
//       const totalRating = allReviews.reduce(
//         (acc, curr) => acc + curr.rating,
//         0
//       );
//       const avgRating = totalRating / allReviews.length;
//       setAverageRating(avgRating);
//     }
//   }, [allReviews]);

//   const handleUpdateReview = async (reviewId, updatedReviewData) => {
//     try {
//       await dispatch(updateReviewThunk(reviewId, updatedReviewData));
//       alert("Review updated successfully");
//     } catch (error) {
//       alert("Failed to update review");
//       console.error(error);
//     }
//   };

//   const handleDeleteReview = async (reviewId) => {
//     try {
//       await dispatch(deleteReviewThunk(reviewId));
//       alert("Review deleted successfully");
//       navigate(0); // Reload the page to reflect the changes
//     } catch (error) {
//       alert("Failed to delete review");
//       console.error(error);
//     }
//   };

//   const dateFormatter = (date) => {
//     return new Date(date).toLocaleDateString(undefined, {
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const renderStarIcons = (rating) => {
//     return [...Array(5)].map((_, i) => (
//       <span key={i} className={i < rating ? "star-filled" : "star-empty"}>
//         {i < rating ? "★" : "☆"}
//       </span>
//     ));
//   };

//   if (isLoading) {
//     return <h2>Loading...</h2>;
//   }

//   if (!opportunity) {
//     return <p>No opportunity details available.</p>;
//   }

//   const userReview = allReviews.find(
//     (review) => review.user_id === currentUser?.id
//   );
//   const relatedReviews = allReviews.filter(
//     (review) => review.opportunity_id === opportunityId
//   );
//   console.log("RELATED REVIEWS>>", relatedReviews);
//   console.log("USER REVIEWS>>", userReview);
//   return (
//     <div className="opportunity-details-container">
//       <h1>{opportunity.title}</h1>
//       <img
//         className="opportunity-detail-image"
//         src={opportunity.image}
//         alt={opportunity.title}
//       />
//       <p className="opportunity-detail-rate">Rate: ${opportunity.rate}</p>
//       <p>Type: {opportunity.type}</p>
//       <p className="opportunity-detail-description">
//         {opportunity.description}
//       </p>
//       <p className="opportunity-review-container">Opportunity Reviews: </p>
//       <div className="average-rating-container">
//         {renderStarIcons(Math.round(averageRating))}
//       </div>
//       {userReview ? (
//         <>
//           <button onClick={() => handleUpdateReview(userReview.id)}>
//             Edit your Review
//           </button>
//           <button onClick={() => handleDeleteReview(userReview.id)}>
//             Delete your Review
//           </button>
//         </>
//       ) : (
//         <button
//           onClick={() =>
//             navigate(`/opportunities/${opportunityId}/reviews/new`)
//           }
//         >
//           Add a Review
//         </button>
//       )}
//       {relatedReviews.reverse().map((review, index) => (
//         <div key={index} className="review-container">
//           <p className="review-user">
//             {allUsers.find((user) => user.id === review.user_id)?.first_name ||
//               "Unknown"}{" "}
//             reviewed:
//           </p>
//           <p className="review-rating">{renderStarIcons(review.rating)}</p>
//           <p className="review-body">{review.body}</p>
//           {review.image && (
//             <img src={review.image} alt="Review" className="review-image" />
//           )}
//           <p className="review-verified-booking">
//             Verified Booking: {review.verified_booking ? "Yes" : "No"}
//           </p>
//           <p className="review-post-date">{dateFormatter(review.created_at)}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OpportunityDetailsPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk } from "../../redux/session";
import { allReviewsOnOneOpportunityThunk } from "../../redux/reviews";
import { getOneOpportunityThunk } from "../../redux/opportunities";

const OpportunityDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { opportunityId } = useParams();
  const opportunity = useSelector((state) => state.opportunities.opportunity);
  const allReviews = useSelector((state) => state.reviews.reviews || []);
  const allUsers = useSelector((state) => state.session.users || []);
  const currentUser = useSelector((state) => state.session.user);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      const totalRating = allReviews.reduce(
        (acc, curr) => acc + curr.rating,
        0
      );
      const avgRating = totalRating / allReviews.length;
      setAverageRating(avgRating);
    }
  }, [allReviews]);

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
    (review) => review.opportunity_id === opportunityId
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
      </div>
      {userReview ? (
        <>
          <button onClick={() => navigate(`/reviews/${userReview.id}/edit`)}>
            Edit your Review
          </button>
          {/* <button onClick={() => handleDeleteReview(userReview.id)}>
            Delete your Review
          </button> */}
        </>
      ) : (
        <button
          onClick={() =>
            navigate(`/opportunities/${opportunityId}/reviews/new`)
          }
        >
          Add a Review
        </button>
      )}
      {relatedReviews.map((review, index) => (
        <div key={index} className="review-container">
          <p className="review-user">
            {allUsers.find((user) => user.id === review.user_id)?.first_name ||
              "Unknown"}{" "}
            reviewed:
          </p>
          <p className="review-rating">{renderStarIcons(review.rating)}</p>
          <p className="review-body">{review.description}</p>
          {console.log(review.description)}
          <p className="review-verified-purchase">
            Verified Purchase: {review.verified_purchase ? "Yes" : "No"}
          </p>
          <p className="review-post-date">{dateFormatter(review.created_at)}</p>
        </div>
      ))}
    </div>
  );
};

export default OpportunityDetailsPage;
