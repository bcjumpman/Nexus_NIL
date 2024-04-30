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
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const getAllUsersThunk = () => async (dispatch) => {
  const response = await fetch(`/api/users`);
  if (!response.ok) {
    throw new Error("Failed to get all users");
  }
  const data = await response.json();
  dispatch(getAllUsers(data));
  return data;
};

const initialState = { user: null };

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
