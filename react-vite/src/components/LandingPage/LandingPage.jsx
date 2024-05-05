import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllThunk } from "../../redux/opportunities";
import { addToCartThunk } from "../../redux/addtocart";
import { getAllUsersCartsThunk } from "../../redux/carts";
import { NavLink, useNavigate } from "react-router-dom";
import "./LandingPage.css";

const AllOpportunities = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // const userCarts = useSelector((state) => state?.carts.carts);
  // const singleCart = userCarts;
  const singleCartId = useSelector((state) => state?.carts?.carts?.[0].id);

  // const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const allOpportunities = useSelector(
    (state) => state.opportunities.opportunities.opportunities
  );

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        await dispatch(loadAllThunk());
        await dispatch(getAllUsersCartsThunk());
      } catch (error) {
        console.error("Failed to load opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
    // console.log("USER CARTS>>>>>>> FROM useEffect", getAllUsersCartsThunk());
  }, [dispatch]);

  const handleAddToCart = (opportunityId) => {
    // console.log("HELLOOOO>>>>>.");
    console.log("SINGLE CART ID FROM LANDING>>>>", singleCartId);
    // console.log("SINGLE CART ID ID FROM LANDING>>>>", cartId);
    dispatch(addToCartThunk(singleCartId, opportunityId));
    // .then(() =>
    // setReload(!reload)
    // );
    navigate("/carts");
  };

  return (
    <div className="opportunities-container">
      {isLoading ? (
        <div className="loading-container">
          <div id="loading-bar" className="loading-bar"></div>
        </div>
      ) : allOpportunities && allOpportunities.length > 0 ? (
        allOpportunities.map((opportunity) => (
          <div className="opportunity-container" key={opportunity.id}>
            <img
              className="opportunity-image"
              src={opportunity.image}
              alt={opportunity.name}
            />
            <div className="opportunity-info">
              <h3>{opportunity.name}</h3>
              <p>
                {opportunity.title} - {opportunity.type}
              </p>
            </div>
            <NavLink to={`/opportunities/${opportunity.id}`}>
              <button>View Details</button>
            </NavLink>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(opportunity.id)}
            >
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <div>No opportunities found</div>
      )}
    </div>
  );
};

export default AllOpportunities;
