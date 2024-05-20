// Action Type
export const CREATE_REVIEW = "reviews/CREATE_NEW";
export const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";
export const DELETE_REVIEW = "reviews/DELETE_REVIEW";
export const GET_ONE_REVIEW = "reviews/GET_ONE_REVIEW";
export const LOAD_UPDATE = "reviews/LOAD_UPDATE";

// Action creator
export const createNewReview = (review) => ({
  type: CREATE_REVIEW,
  review,
});

export const updateReview = (data) => ({
  type: UPDATE_REVIEW,
  data,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

export const allReviewsForOne = (data) => ({
  type: GET_ONE_REVIEW,
  data,
});

export const loadReviewById = (data) => ({
  type: LOAD_UPDATE,
  data,
});
export const setLoading = (loading) => ({
  type: "reviews/SET_LOADING",
  loading,
});

export const setError = (error) => ({
  type: "reviews/SET_ERROR",
  error,
});

// THUNKS
//* Get review by id
export const getReviewById = (reviewId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`);

    if (!response.ok) {
      throw new Error("Failed to load the review.");
    }

    const review = await response.json();
    dispatch(loadReviewById(review));
    return review;
  } catch (error) {
    return { error: error.message };
  }
};

// //* Create New Review Thunk
// export const createReviewThunk =
//   (opportunityId, newReview) => async (dispatch) => {
//     try {
//       const response = await fetch(
//         `/api/opportunities/${opportunityId}/reviews/new`,
//         {
//           method: "POST",
//           body: newReview,
//         }
//       );

//       if (response.ok) {
//         dispatch(createNewReview(newReview));
//       } else {
//         throw new Error("Failed to create new review.");
//       }
//     } catch (error) {
//       return { error: error.message };
//     }
//   };

// //* Update a Review Thunk
// export const updateReviewThunk =
//   (reviewId, updatingReview) => async (dispatch) => {
//     try {
//       const response = await fetch(`/api/reviews/${reviewId}/edit`, {
//         method: "PUT",
//         body: updatingReview,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update review");
//       }
//       dispatch(updateReview(updatingReview));
//     } catch (error) {
//       return { error: error.message };
//     }
//   };

//* Create New Review Thunk
export const createReviewThunk =
  (opportunityId, reviewData) => async (dispatch) => {
    let response;
    try {
      response = await fetch(
        `/api/opportunities/${opportunityId}/reviews/new`,
        {
          method: "POST",
          body: reviewData,
        }
      );

      if (response.ok) {
        const createdReview = await response.json();
        dispatch(createNewReview(createdReview));
        return createdReview;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create new review.");
      }
    } catch (error) {
      console.error("Create review error:", error);

      return { error: error.message };
    }
  };

//* Update a Review Thunk
export const updateReviewThunk = (reviewId, reviewData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}/edit`, {
      method: "PUT",
      body: reviewData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update review");
    }
    dispatch(updateReview(data));
    return data;
  } catch (error) {
    console.error("Error updating review:", error);
    return { error: error.message };
  }
};

//* Delete a Review Thunk
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteReview(reviewId));
      return { success: "Review deleted successfully" };
    } else {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete review.");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error: error.message };
  }
};

//* Load all reviews for a opportunity
// export const allReviewsOnOneOpportunityThunk =
//   (opportunityId) => async (dispatch) => {
//     dispatch({ type: "reviews/SET_LOADING", loading: true });
//     try {
//       const response = await fetch(
//         `/api/opportunities/${opportunityId}/reviews/all`
//       );
//       if (!response.ok)
//         throw new Error("Failed to load reviews for the opportunity.");
//       const data = await response.json();
//       dispatch(allReviewsForOne(data.reviews));
//     } catch (error) {
//       dispatch({ type: "reviews/SET_ERROR", error: error.message });
//     } finally {
//       dispatch({ type: "reviews/SET_LOADING", loading: false });
//     }
//   };

export const allReviewsOnOneOpportunityThunk =
  (opportunityId) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/opportunities/${opportunityId}/reviews/all`
      );

      if (!response.ok) {
        throw new Error("Failed to load reviews for the opportunity.");
      }

      const data = await response.json();
      dispatch(allReviewsForOne(data.reviews));
      return data.reviews;
    } catch (error) {
      return { error: error.message };
    }
  };

// REDUCERS
const initialState = {
  reviews: [],
  review: null,
  reviewDetails: [], //* might need to change this back to {}
  loading: false,
  error: null,
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case "reviews/SET_LOADING":
      return { ...state, loading: action.loading };
    case "reviews/SET_ERROR":
      return { ...state, error: action.error };
    case CREATE_REVIEW:
      return { ...state, reviews: [...state.reviews, action.review] };
    case UPDATE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.data.id ? action.data : review
        ),
      };
    case DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter(
          (review) => review.id !== action.reviewId
        ),
      };
    case GET_ONE_REVIEW:
      return { ...state, reviews: action.data };
    case LOAD_UPDATE:
      return { ...state, review: action.data };
    default:
      return state;
  }
};

export default reviewReducer;
