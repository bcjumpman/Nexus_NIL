import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import * as CartActions from "../../redux/carts";
import * as OpportunityActions from "../../redux/opportunities";
import { updateCartThunk } from "../../redux/addtocart";
import { useModal } from "../../context/Modal";
import { removeFromCartThunk } from "../../redux/addtocart";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./Cart.css";

const CartManagement = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.session.user);
  const allOpportunities = useSelector(
    (state) => state?.opportunities?.opportunities.opportunities
  );
  const userCart = useSelector((state) => state?.carts?.cart_items);
  // const userCarts = useSelector((state) => state?.carts?.carts);
  const userCarts = useSelector((state) => state?.carts?.carts);
  const singleCart = userCarts;
  const CartItems = useSelector((state) => state?.carts?.carts?.[0].cart_items);
  const singleItem = useSelector(
    (state) => state?.carts?.carts?.[0].cart_items[0]
  );
  // const [quantities, setQuantities] = useState({});
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { closeModal } = useModal();

  // console.log("ALL OPPS>>>>", allOpportunities);
  // console.log("SINGLE CART>>>", singleCart);
  console.log("CART ITEMS>>>", CartItems);
  console.log("SINGLE ITEM>>>", singleItem);
  const CheckoutMessage = ({ message }) => {
    return (
      <div className="checkout-message">
        <h4>{message}</h4>
      </div>
    );
  };
  //* getting user's cart
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(OpportunityActions.loadAllThunk());
        await dispatch(CartActions.getAllUsersCartsThunk());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, CartItems?.length]);
  // }, [dispatch, CartItems?.length]);
  // }, [dispatch]);

  // //* action of incrementing
  // const handleIncrement = (opportunityId) => {
  //   setQuantities((prevQuantities) => ({
  //     ...prevQuantities,
  //     [opportunityId]:
  //       (prevQuantities[opportunityId] ||
  //         userCart.find((item) => item.opportunity_id == opportunityId)
  //           ?.quantity_added) + 1,
  //   }));
  // };

  // //* action of decrementing
  // const handleDecrement = (opportunityId) => {
  //   if (quantities[opportunityId] > 1) {
  //     setQuantities((prevQuantities) => ({
  //       ...prevQuantities,
  //       [opportunityId]: prevQuantities[opportunityId] - 1,
  //     }));
  //   }
  // };

  //* adding opp to cart
  // const handleAddToCart = (opportunityId) => {
  //   dispatch(addToCartThunk(userCart?.id, opportunityId)).then(() =>
  //     setReload(!reload)
  //   );
  // };

  //* updating cart
  const handleUpdateCart = () => {
    const updatedCart = userCart.map((item) => ({
      cart_id: item.cart_id,
      opportunity_id: item.opportunity_id,
    }));
    dispatch(updateCartThunk(updatedCart)).then(() => setReload(!reload));
  };

  //* deleting opp from cart
  // const handleDeleteItem = async (cartItemId) => {
  //   console.log("CART ITEM ID>>>", cartItemId.id);
  //   await dispatch(removeFromCartThunk(cartItemId.id)).then(() =>
  //     setReload(!reload)
  //   );
  // };
  const handleDeleteItem = async (cartItemId) => {
    console.log("CART ITEM ID>>>", cartItemId.id);
    try {
      await dispatch(removeFromCartThunk(cartItemId.id));
      setReload(!reload); // This will toggle the reload state to trigger updates as needed
      alert(
        "Item deleted successfully. Please refresh your page to view updated cart."
      );
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  //* checkout cart
  const handleCheckout = async () => {
    console.log("SINGLE CART>>>>", singleCart);
    for (let item of singleCart) {
      await dispatch(removeFromCartThunk(item.id));
    }
    setTimeout(() => {
      closeModal();
    }, 2000);
    setReload(!reload);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!currentUser || !userCart || !allOpportunities) {
    return <p>Please login or sign up to view cart!</p>;
  }

  return (
    <div>
      <div>Welcome, {currentUser.first_name}</div>
      <div>
        {/* {singleCart?.length > 0 ? ( */}
        {CartItems?.length > 0 ? (
          <h2>Your NIL Deals Are Waiting...</h2>
        ) : (
          <div>
            <h2>Your Cart is Empty...</h2>
            <h3>
              {/* Check your Saved for Later items below or{" "} */}
              <NavLink to="/">Continue Shopping...</NavLink>
            </h3>
          </div>
        )}
        <ul>
          {CartItems &&
            CartItems.map((item, index) => (
              <li key={`${item.opportunity_id}-${index}`} className="cart-item">
                <NavLink to={`/opportunities/${item.opportunity_id}`}>
                  {/* <img
                    src={
                      allOpportunities?.find(
                        (opportunity) => opportunity.id === item.opportunity_id
                      )?.image
                    }
                    alt="Opportunity Image"
                    className="thumbnail"
                  /> */}
                </NavLink>
                <div className="cart-item-details">
                  <p className="cart-item-name">
                    {
                      allOpportunities?.find(
                        (opportunity) => opportunity.id == item.opportunity_id
                      )?.title
                    }
                    :
                    {
                      allOpportunities?.find(
                        (opportunity) => opportunity.id == item.opportunity_id
                      )?.type
                    }
                  </p>
                  {/* <di  */}
                  <p className="cart-item-rate">
                    Rate:{" $"}
                    {(
                      allOpportunities?.find(
                        (opportunity) => opportunity.id == item.opportunity_id
                      )?.rate || 0
                    ).toFixed(0)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem(singleItem)}
                  className="cart-item-delete"
                >
                  Remove from Cart
                </button>
              </li>
            ))}
        </ul>
        <div className="cart-total">
          <p>
            Potential Earnings:{" $"}
            {CartItems.reduce(
              (total, item) =>
                total +
                (allOpportunities?.find(
                  (opportunity) => opportunity.id == item.opportunity_id
                )?.rate || 0),
              0
            ).toFixed(0)}
          </p>
          <div className="cart-action-buttons">
            <button
              className="save-btn"
              onClick={() => {
                handleUpdateCart();
                window.location.href = "/";
              }}
            >
              Save for Later
            </button>
            {/* Conditionally render checkout button */}
            {CartItems.length > 0 && (
              <OpenModalButton
                className="checkout-btn"
                buttonText="Checkout"
                modalComponent={
                  <CheckoutMessage
                    message={`Thank you ${currentUser.first_name} for using Nexus. Your proposals have been sent. Keep an eye on your email.!`}
                  />
                }
                onButtonClick={handleCheckout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartManagement;
