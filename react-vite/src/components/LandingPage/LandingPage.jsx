// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loadAllThunk } from "../../redux/opportunities";
// import { addToCartThunk } from "../../redux/addtocart";
// import { getAllUsersCartsThunk } from "../../redux/carts";
// import { NavLink, useNavigate } from "react-router-dom";
// import "./LandingPage.css";

// const AllOpportunities = () => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   // const userCarts = useSelector((state) => state?.carts.carts);
//   // const singleCart = userCarts;
//   const singleCartId = useSelector((state) => state?.carts?.carts?.[0].id);

//   // const [reload, setReload] = useState(false);
//   const navigate = useNavigate();
//   const allOpportunities = useSelector(
//     (state) => state.opportunities.opportunities.opportunities
//   );

//   useEffect(() => {
//     const fetchOpportunities = async () => {
//       try {
//         await dispatch(loadAllThunk());
//         await dispatch(getAllUsersCartsThunk());
//       } catch (error) {
//         console.error("Failed to load opportunities:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOpportunities();
//   }, [dispatch]);

//   const handleAddToCart = (opportunityId) => {
//     dispatch(addToCartThunk(singleCartId, opportunityId));
//     // .then(() =>
//     // setReload(!reload)
//     // );
//     navigate("/carts");
//   };

//   return (
//     <div className="opportunities-container">
//       {isLoading ? (
//         <div className="loading-container">
//           <div id="loading-bar" className="loading-bar"></div>
//         </div>
//       ) : allOpportunities && allOpportunities.length > 0 ? (
//         allOpportunities.map((opportunity) => (
//           <div className="opportunity-container" key={opportunity.id}>
//             <img
//               className="opportunity-image"
//               src={opportunity.image}
//               alt={opportunity.name}
//             />
//             <div className="opportunity-info">
//               <h3>{opportunity.name}</h3>
//               <p>
//                 {opportunity.title} - {opportunity.type}
//               </p>
//             </div>
//             <NavLink to={`/opportunities/${opportunity.id}`}>
//               <button>View Details</button>
//             </NavLink>
//             <button
//               className="add-to-cart-button"
//               onClick={() => handleAddToCart(opportunity.id)}
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))
//       ) : (
//         <div>No opportunities found</div>
//       )}
//     </div>
//   );
// };

// export default AllOpportunities;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllThunk } from "../../redux/opportunities";
import { addToCartThunk } from "../../redux/addtocart";
import { getAllUsersCartsThunk } from "../../redux/carts";
import { NavLink, useNavigate } from "react-router-dom";
import "./LandingPage.css";
import ReactPaginate from "react-paginate"; // Import ReactPaginate for pagination

const AllOpportunities = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // State to track current page
  const singleCartId = useSelector((state) => state?.carts?.carts?.[0].id);

  const itemsPerPage = 20; // Number of items per page

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
  }, [dispatch]);

  const handleAddToCart = (opportunityId) => {
    dispatch(addToCartThunk(singleCartId, opportunityId));
    navigate("/carts");
  };

  // Check if allOpportunities is undefined
  if (!allOpportunities) {
    return <div>Loading...</div>;
  }

  // Calculate total pages
  const totalPages = Math.ceil(allOpportunities.length / itemsPerPage);

  // Slice data for current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(
    (currentPage + 1) * itemsPerPage,
    allOpportunities.length
  );
  const paginatedOpportunities = allOpportunities.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="opportunities-container">
      {isLoading ? (
        <div className="loading-container">
          <div id="loading-bar" className="loading-bar"></div>
        </div>
      ) : paginatedOpportunities && paginatedOpportunities.length > 0 ? (
        paginatedOpportunities.map((opportunity) => (
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

      {/* Render Pagination Component */}
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5} // Number of page links to display
        marginPagesDisplayed={2} // Number of margin pages to display
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default AllOpportunities;
