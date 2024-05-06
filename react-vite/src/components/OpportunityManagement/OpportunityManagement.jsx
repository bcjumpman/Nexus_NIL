import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { loadOwnedOppsThunk, deleteOppThunk } from "../../redux/opportunities";
import "./OpportunityManagement.css";

const OpportunityManagement = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.session?.user);
  const opportunities = useSelector(
    (state) => state?.opportunities?.opportunities?.opportunities
  );
  const { setModalContent, closeModal } = useModal();
  // console.log("OPPORTUNITIES>>>>>>", opportunities);
  useEffect(() => {
    dispatch(loadOwnedOppsThunk());
  }, [dispatch]);

  const handleAddOpportunity = () => {
    window.location.href = `/opportunities/manage/new`;
  };

  const handleEditOpportunity = (opportunityId) => {
    window.location.href = `/opportunities/manage/${opportunityId}/edit`;
  };

  const openDeleteModal = (opportunityId) => {
    setModalContent(
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this opportunity?</p>
        <div className="modal-buttons">
          <button className="modal-button-cancel" onClick={closeModal}>
            Cancel
          </button>
          <button
            className="modal-button-confirm"
            onClick={() => handleDeleteOpportunity(opportunityId)}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  };

  const handleDeleteOpportunity = async (opportunityId) => {
    if (opportunityId) {
      await dispatch(deleteOppThunk(opportunityId));

      closeModal();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  if (!opportunities || !currentUser) {
    return <p>Loading... Please Hold!</p>;
  }

  return (
    <div className="opportunity-management-container">
      <h1 className="welcome-title">Welcome, {currentUser.first_name}!</h1>
      <h4 className="page-title">Manage your Opportunities</h4>
      {opportunities.map(
        (opportunity) =>
          opportunity.user_id === currentUser.id && (
            <div key={opportunity.id} className="opportunity-item">
              <div className="opportunity-details">
                <h3 className="opportunity-title">{opportunity.title}</h3>
                <p className="opportunity-description">
                  {opportunity.description}
                </p>
                <p className="opportunity-type">Type: {opportunity.type}</p>
                <div className="opportunity-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditOpportunity(opportunity.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => openDeleteModal(opportunity.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
      )}
      <h5 className="adding-title">Want to add a new opportunity?</h5>
      <button
        className="add-opportunity-button"
        onClick={() => handleAddOpportunity()}
      >
        Add New Opportunity
      </button>
    </div>
  );
};

export default OpportunityManagement;
