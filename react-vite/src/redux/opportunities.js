//* Action type
export const LOAD_ALL_OPPORTUNITIES = "opportunities/LOAD_ALL";
export const GET_ONE_OPPORTUNITY = "opportunities/GET_ONE";
export const ADD_NEW_OPPORTUNITY = "opportunities/ADD_NEW";

//* Action creator
export const loadAllOpportunities = (data) => ({
  type: LOAD_ALL_OPPORTUNITIES,
  data,
});

export const getOneOpportunity = (data) => ({
  type: GET_ONE_OPPORTUNITY,
  data,
});

export const addNewOpportunity = (data) => ({
  type: ADD_NEW_OPPORTUNITY,
  data,
});

// THUNKS

//* Load all opportunities thunk
export const loadAllThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/opportunities", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to load opportunities.");
    }

    const data = await response.json();

    dispatch(loadAllOpportunities(data));
  } catch (error) {
    return { error: error.message };
  }
};

//* Get one opportunity
export const getOneOpportunityThunk = (opportunityId) => async (dispatch) => {
  try {
    // print("OPPORTUNITY ID>>>", opportunityId);
    const response = await fetch(`/api/opportunities/${opportunityId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch opportunity.");
    }

    const data = await response.json();

    dispatch(getOneOpportunity(data));
  } catch (error) {
    return { error: error.message };
  }
};

//*  Add new opportunity
export const addNewOpportunityThunk = (newOpportunity) => async (dispatch) => {
  try {
    const response = await fetch(`/api/opportunities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOpportunity),
    });

    if (response.ok) {
      const data = await response.json();

      dispatch(addNewOpportunity(data));
    } else {
      throw new Error("Failed to add new opportunity.");
    }
  } catch (error) {
    return { error: error.message };
  }
};

// REDUCERS

//* Action reducer
const opportunityReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_ALL_OPPORTUNITIES: {
      return { ...state, ...action.data };
    }
    case GET_ONE_OPPORTUNITY: {
      return { ...state, ...action.data };
    }
    case ADD_NEW_OPPORTUNITY: {
      return { ...state, ...action.data };
    }
    default:
      return state;
  }
};

export default opportunityReducer;
