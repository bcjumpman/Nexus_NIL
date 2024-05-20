// Action Types
export const ADDING_TO_CART = "carts/ADDING_TO_CART";
export const UPDATING_CART = "carts/UPDATING_CART";
export const REMOVE_FROM_CART = "carts/REMOVE_FROM_CART";

// Action Creators
export const addingToCart = (data) => ({
  type: ADDING_TO_CART,
  data,
});

export const updatingCart = (data) => ({
  type: UPDATING_CART,
  data,
});

export const removeFromCart = (item) => ({
  type: REMOVE_FROM_CART,
  item,
});

//* Adding opps to cart thunk
export const addToCartThunk = (cart_id, opportunity_id) => async (dispatch) => {
  // To add mulitple opps, we should get rid of opp_id and replace
  // with opp arr []. ITs an array of opportunities and pass
  // into stringify method cart_id, opportunities_array
  try {
    const response = await fetch("/api/opportunities/cart/add_opportunity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id, opportunity_id }),
    });
    if (!response.ok) {
      throw new Error("Failed to add opportunity to cart.");
    }
    const data = await response.json();
    dispatch(addingToCart(data));
  } catch (error) {
    throw new Error("Failed to add opportunity to cart.");
  }
};

//* Updating  cart think
export const updateCartThunk = (cartItems) => async (dispatch) => {
  try {
    const response = await fetch(`/api/opportunities/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_items: cartItems }),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart.");
    }
    const data = await response.json();
    dispatch(updatingCart(cartItems, data));
  } catch (error) {
    throw new Error("Failed to update cart.");
  }
};

//* Remove opps from cart
export const removeFromCartThunk = (cartItemId) => async (dispatch) => {
  try {
    const response = await fetch(
      `/api/opportunities/cart/remove/${cartItemId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove opportunity from your cart");
    }
    const data = await response.json();
    dispatch(removeFromCart(data));
  } catch (error) {
    return { error: error.message };
  }
};

// Reducer
const addToCartReducer = (state = {}, action) => {
  switch (action.type) {
    case ADDING_TO_CART:
      return { ...state, ...action.data };
    case UPDATING_CART:
      return { ...state, ...action.data };
    case REMOVE_FROM_CART: {
      const newState = { ...state };

      delete newState[action.item.id];
      return newState;
    }
    default:
      return state;
  }
};

export default addToCartReducer;
