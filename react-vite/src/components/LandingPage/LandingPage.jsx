// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loadAllThunk } from "../../redux/opportunities";
// import { NavLink } from "react-router-dom";

// const AllOpportunities = () => {
//   const dispatch = useDispatch();
//   const allOpportunities = useSelector(
//     (state) => state.opportunities.opportunities
//   );
//   const [isLoading, setIsLoading] = useState(true);
//   const [isReloading, setIsReloading] = useState(false);

//   useEffect(() => {
//     dispatch(loadAllThunk())
//       .then(() => setIsLoading(false))
//       .catch(() => setIsLoading(false));
//   }, [dispatch, isReloading]);

//   return (
//     <div className="opportunities-container">
//       {/* display loading if not true */}
//       {isLoading && (
//         <div className="loading-container">
//           <div id="loading-bar" className="loading-bar"></div>
//         </div>
//       )}
//       {/* Rendering opportunities when loading is complete */}
//       {!isLoading &&
//         (allOpportunities && allOpportunities.length > 0 ? (
//           allOpportunities.map((opportunity) => (
//             <div className="opportunity-container" key={opportunity.id}>
//               <h3>{opportunity.name}</h3>
//               <NavLink to={`/opportunities/${opportunity.id}`}>
//                 <button />
//               </NavLink>
//               {/* <button className="add-to-cart-button" onClick={() => handleAddToCart(opportunity.id)}>Add to Cart</button> */}
//             </div>
//           ))
//         ) : (
//           <div>No opportunities found</div>
//         ))}
//     </div>
//   );
// };

// export default AllOpportunities;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllThunk } from "../../redux/opportunities";
import { NavLink } from "react-router-dom";
import "./LandingPage.css";

const AllOpportunities = () => {
  const dispatch = useDispatch();
  const allOpportunities = useSelector(
    (state) => state.opportunities.opportunities
  );
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="opportunities-container">
      {isLoading ? (
        <div className="loading-container">
          <div id="loading-bar" className="loading-bar"></div>
        </div>
      ) : allOpportunities && allOpportunities.length > 0 ? (
        allOpportunities.map((opportunity) => (
          <div className="opportunity-container" key={opportunity.id}>
            <h3>{opportunity.name}</h3>
            <NavLink to={`/opportunities/${opportunity.id}`}>
              <button>View Details</button>
            </NavLink>
          </div>
        ))
      ) : (
        <div>No opportunities found</div>
      )}
    </div>
  );
};

export default AllOpportunities;
