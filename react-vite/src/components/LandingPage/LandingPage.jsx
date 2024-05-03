import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllThunk } from "../../redux/opportunities";
import { addToCartThunk } from "../../redux/addtocart";
import { NavLink } from "react-router-dom";
import "./LandingPage.css";

const AllOpportunities = () => {
  const dispatch = useDispatch();
  const allOpportunities = useSelector(
    (state) => state.opportunities.opportunities.opportunities
  );

  const [isLoading, setIsLoading] = useState(true);
  const userCart = useSelector((state) => state?.carts?.cart_items);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        await dispatch(loadAllThunk());
      } catch (error) {
        console.error("Failed to load opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [dispatch]);

  const handleAddToCart = (opportunityId) => {
    dispatch(addToCartThunk(userCart?.id, opportunityId)).then(() =>
      setReload(!reload)
    );
    window.location.href = "/carts";
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
