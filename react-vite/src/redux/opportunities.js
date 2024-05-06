// Action Types
export const LOAD_ALL_OPPORTUNITIES = "opportunities/LOAD_ALL";
export const GET_ONE_OPPORTUNITY = "opportunities/GET_ONE";
export const OWNED_OPPS = "opportunities/OWNED_OPPS";
export const ADD_NEW_OPPORTUNITY = "opportunities/ADD_NEW";
export const EDIT_A_OPPORTUNITY = "opportunities/EDIT";
export const DELETE_A_OPPORTUNITY = "opportunities/DELETE";
export const SET_LOADING = "opportunities/SET_LOADING";
export const SET_ERROR = "opportunities/SET_ERROR";

// Action Creators
export const loadAllOpportunities = (data) => ({
  type: LOAD_ALL_OPPORTUNITIES,
  payload: data,
});

export const getOneOpportunity = (data) => ({
  type: GET_ONE_OPPORTUNITY,
  data,
});

export const loadOwnwedOpps = (data) => ({
  type: OWNED_OPPS,
  data,
});

export const addNewOpportunity = (data) => ({
  type: ADD_NEW_OPPORTUNITY,
  data,
});
export const editAOpportunity = (data) => ({
  type: EDIT_A_OPPORTUNITY,
  data,
});

export const deleteAOpportunity = (data) => ({
  type: DELETE_A_OPPORTUNITY,
  data,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  error,
});

// Thunks
// export const loadAllThunk = () => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const response = await fetch("/api/opportunities");
//     if (!response.ok) {
//       throw new Error("Failed to load opportunities.");
//     }
//     const data = await response.json();
//     dispatch(loadAllOpportunities(data));
//   } catch (error) {
//     dispatch(setError(error.message));
//   }
//   dispatch(setLoading(false));
// };

// export const loadAllThunk = () => async (dispatch) => {
//   try {
//     const response = await fetch("/api/opportunities");
//     const data = await response.json();
//     dispatch({ type: "LOAD_ALL_OPPORTUNITIES", payload: data });
//   } catch (error) {
//     console.error("Failed to fetch opportunities:", error);
//   }
// };

export const loadAllThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/opportunities");
    if (response.ok) {
      const data = await response.json();
      dispatch({ type: "opportunities/LOAD_ALL", payload: data });
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching opportunities:", error);
  }
};

export const getOneOpportunityThunk = (opportunityId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`/api/opportunities/${opportunityId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch opportunity.");
    }
    const data = await response.json();
    dispatch(getOneOpportunity(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
  dispatch(setLoading(false));
};

export const loadOwnedOppsThunk = () => async (dispatch) => {
  try {
    const response = await fetch(`/api/opportunities/manage`);

    if (!response.ok) {
      throw new Error("Failed to fetch opportunities.");
    }

    const data = await response.json();
    dispatch(loadOwnwedOpps(data));
  } catch (error) {
    return { error: error.message };
  }
};

// export const addNewOpportunityThunk = (newOpportunity) => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const response = await fetch(`/api/opportunities`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newOpportunity),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to add new opportunity.");
//     }
//     const data = await response.json();
//     dispatch(addNewOpportunity(data));
//   } catch (error) {
//     dispatch(setError(error.message));
//   }
//   dispatch(setLoading(false));
// };

export const addNewOpportunityThunk = (newOpportunity) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`/api/opportunities/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOpportunity),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to add new opportunity:", errorData);
      dispatch(setError(errorData.errors || "Unknown error"));
      return;
    }

    const data = await response.json();
    console.log("New opportunity added:", data);
    dispatch(addNewOpportunity(data));
  } catch (error) {
    console.error("Error adding new opportunity:", error);
    dispatch(setError(error.toString()));
  } finally {
    dispatch(setLoading(false));
  }
};

export const editOppThunk = (opportunityId, editOpp) => async (dispatch) => {
  try {
    const response = await fetch(`/api/opportunities/${opportunityId}/edit`, {
      method: "PUT",
      body: editOpp,
    });

    if (!response.ok) {
      throw new Error("Failed to update opportunity");
    }

    const data = await response.json();
    dispatch(editAOpportunity(data));
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteOppThunk = (opportunityId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/opportunities/${opportunityId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteAOpportunity(opportunityId));
      return { success: true };
    } else {
      throw new Error("Failed to delete opportunity.");
    }
  } catch (error) {
    return { error: error.message };
  }
};

// Reducer
const initialState = {
  opportunities: [],
  opportunity: null,
  loading: false,
  error: null,
};

const opportunityReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_OPPORTUNITIES:
      // console.log("ACTION PAYLOAD", action.payload);
      return { ...state, opportunities: action.payload };
    case GET_ONE_OPPORTUNITY:
      return { ...state, opportunity: action.data };
    case OWNED_OPPS:
      return {
        ...state,
        ...action.data,
      };
    case ADD_NEW_OPPORTUNITY:
      return {
        ...state,
        opportunities: [...state.opportunities, action.data],
        error: null,
      };

    // return state;
    case EDIT_A_OPPORTUNITY: {
      return action.data;
    }
    case DELETE_A_OPPORTUNITY: {
      const newState = { ...state };
      delete newState[action.data];
      return newState;
    }
    case SET_LOADING:
      return { ...state, loading: action.loading };
    case SET_ERROR:
      return {
        ...state,
        error: action.error,
        opportunities: [],
        opportunity: null,
      };
    default:
      return state;
  }
};

export default opportunityReducer;
