import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import ProfileButton from "./ProfileButton";
import { useSelector, useDispatch } from "react-redux";
import { loadAllThunk } from "../../redux/opportunities";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const allOpportunities = useSelector(
    (state) => state.opportunities.opportunities.opportunities
  );
  useEffect(() => {
    dispatch(loadAllThunk());
  }, [dispatch]);

  const types = allOpportunities
    ? [...new Set(allOpportunities.map((opportunity) => opportunity.type))]
    : [];

  const handleTypeClick = (event) => {
    event.preventDefault(); // Prevent the navigation
    alert("Feature coming soon");
  };
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

      <div className="type-section">
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
      </div>

      <div className="additional-links">
        <div className="profile-button">
          <ProfileButton />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
