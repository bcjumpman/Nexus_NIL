import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileButton from "./ProfileButton";
import { useDispatch } from "react-redux";
import { loadAllThunk } from "../../redux/opportunities";
import CartManagement from "../Cart/Cart";
import { FaCartShopping } from "react-icons/fa6";

import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const [showCart, setShowCart] = useState(false);
  // const allOpportunities = useSelector(
  //   (state) => state.opportunities.opportunities.opportunities
  // );
  useEffect(() => {
    dispatch(loadAllThunk());
  }, [dispatch]);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Comment in when adding types to nav bar
  // const types = allOpportunities
  //   ? [...new Set(allOpportunities.map((opportunity) => opportunity.type))]
  //   : [];

  // const handleTypeClick = (event) => {
  //   event.preventDefault(); // Prevent the navigation
  //   alert("Feature coming soon");
  // };
  return (
    <nav>
      <div className="navigation-logo-container">
        <NavLink to="/">
          <img
            src="https://res.cloudinary.com/dkjaxm35z/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714517299/Capstone/Screenshot_2024-04-30_at_3.48.10_PM_izjstj.png"
            alt="Nexus-logo"
            className="nav-bar-logo"
          ></img>
        </NavLink>
      </div>

      {/* <div className="type-section">
        <ul>
          {types.map((type) => (
            <li key={type}>
              <NavLink
                to={`/opportunities/types/${type}`}
                onClick={handleTypeClick}
              >
                {type}
              </NavLink>
            </li>
          ))}
        </ul>
      </div> */}

      <div className="additional-links">
        <div className="profile-button">
          <ProfileButton />
        </div>
        <div className="cart-button">
          <button className="toggle-cart" onClick={toggleCart}>
            <FaCartShopping />
          </button>
          <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
            <button className="close-cart" onClick={toggleCart}>
              Close
            </button>
            <button
              className="view-cart"
              onClick={() => (window.location.href = "/carts")}
            >
              View Cart
            </button>
            <div className="cart-content">
              {/* Cart items */}
              <CartManagement />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
