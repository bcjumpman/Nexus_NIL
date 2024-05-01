const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const GET_ALL_USERS = "session/getAllUsers";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const getAllUsers = (users) => ({
  type: GET_ALL_USERS,
  users,
});

export const setLoading = (loading) => ({
  type: "SET_LOADING",
  loading,
});

export const setError = (error) => ({
  type: "SET_ERROR",
  error,
});

export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkLogout = () => async (dispatch) => {
  try {
    const response = await fetch("/api/auth/logout");
    if (!response.ok) {
      throw new Error("Logout failed on the server");
    }
    dispatch(removeUser());
  } catch (error) {
    console.error("Logout error:", error);
    // Optionally handle error in UI, e.g., show a message
  }
};

export const getAllUsersThunk = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`/api/users`);
    if (!response.ok) {
      throw new Error(
        `Failed to get all users: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    dispatch(getAllUsers(data));
  } catch (error) {
    console.error(error);
    dispatch(setError(error.toString()));
  } finally {
    dispatch(setLoading(false));
  }
};

const initialState = { user: null, users: [], loading: false, error: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case GET_ALL_USERS:
      return { ...state, ...action.users };
    default:
      return state;
  }
}

export default sessionReducer;
