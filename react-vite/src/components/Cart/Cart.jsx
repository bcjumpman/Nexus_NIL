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
    (state) => state?.opportunities?.opportunities
  );
  const userCart = useSelector((state) => state?.carts?.cart_items);
  const [quantities, setQuantities] = useState({});
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { closeModal } = useModal();

  const CheckoutMessage = ({ message }) => {
    return (
      <div>
        <h4>{message}</h4>
      </div>
    );
  };
  //* getting user's cart
  // works
  // useEffect(() => {
  //   dispatch(OpportunityActions.loadAllThunk());
  //   dispatch(CartActions.getAllUsersCartsThunk())
  //     .then(() => {
  //       setIsLoading(false);
  //       const initialQuantities = {};
  //       userCart.forEach((item) => {
  //         initialQuantities[item.opportunity_id] = item.quantity_added;
  //       });
  //       setQuantities(initialQuantities);
  //     })
  //     .catch(() => setIsLoading(false));
  // }, [dispatch, reload]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(OpportunityActions.loadAllThunk());
        await dispatch(CartActions.getAllUsersCartsThunk());
        const initialQuantities = {};
        userCart?.forEach((item) => {
          initialQuantities[item.opportunity_id] = item.quantity_added;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userCart?.length]);
  // }, [dispatch]);

  //* action of adding
  const handleIncrement = (opportunityId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [opportunityId]:
        (prevQuantities[opportunityId] ||
          userCart.find((item) => item.opportunity_id == opportunityId)
            ?.quantity_added) + 1,
    }));
  };

  //* action of removing
  const handleDecrement = (opportunityId) => {
    if (quantities[opportunityId] > 1) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [opportunityId]: prevQuantities[opportunityId] - 1,
      }));
    }
  };

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
  const handleDeleteItem = async (cartItemId) => {
    await dispatch(removeFromCartThunk(cartItemId)).then(() =>
      setReload(!reload)
    );
  };

  //* checkout cart
  const handleCheckout = async () => {
    for (let item of userCart) {
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
    return <p>Please give us a second...</p>;
  }

  return (
    <div>
      <div>Welcome, {currentUser.first_name}</div>
      <div>
        {userCart?.length > 0 ? (
          <h2>Your NIL Deals Are Waiting...</h2>
        ) : (
          <div>
            <h2>Your Cart is Empty...</h2>
            <h3>
              Check your Saved for Later items below or{" "}
              <NavLink to="/">Continue Shopping...</NavLink>
            </h3>
          </div>
        )}
        <ul>
          {userCart &&
            userCart.map((item) => (
              <li key={item.opportunity_id} className="cart-item">
                <NavLink to={`/opportunities/${item.opportunity_id}`}>
                  <img
                    src={
                      allOpportunities?.find(
                        (opportunity) => opportunity.id === item.opportunity_id
                      )?.image
                    }
                    alt="Opportunity Image"
                    className="thumbnail"
                  />
                </NavLink>
                <div className="cart-item-details">
                  <p className="cart-item-name">
                    {
                      allOpportunities?.find(
                        (opportunity) => opportunity.id == item.opportunity_id
                      )?.title
                    }
                  </p>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() => handleDecrement(item.opportunity_id)}
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleIncrement(item.opportunity_id)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-rate">
                    Rate:{" "}
                    {(
                      allOpportunities?.find(
                        (opportunity) => opportunity.id == item.opportunity_id
                      )?.rate || 0
                    ).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="cart-item-delete"
                >
                  Remove from Cart
                </button>
              </li>
            ))}
        </ul>
        <div className="cart-total">
          <p>
            Total:{" "}
            {userCart
              .reduce(
                (total, item) =>
                  total +
                  (allOpportunities?.find(
                    (opportunity) => opportunity.id == item.opportunity_id
                  )?.rate || 0),
                0
              )
              .toFixed(2)}
          </p>
          <div className="cart-action-buttons">
            <button
              onClick={() => {
                handleUpdateCart();
                window.location.href = "/";
              }}
            >
              Save for Later
            </button>
            {/* Conditionally render checkout button */}
            {userCart.length > 0 && (
              <OpenModalButton
                buttonText="Checkout"
                modalComponent={
                  <CheckoutMessage
                    message={`Thank you ${currentUser.first_name} for using Nexus. Your request(s) has been sent!`}
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
