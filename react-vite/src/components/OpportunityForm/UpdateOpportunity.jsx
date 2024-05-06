import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneOpportunityThunk } from "../../redux/opportunities";
import CreateOpportunityForm from "./OpportunitiesForm";

const UpdateOpportunity = () => {
  const dispatch = useDispatch();
  const { opportunityId } = useParams();
  const opportunity = useSelector((state) => state?.opportunities?.opportunity);

  useEffect(() => {
    if (opportunityId) {
      dispatch(getOneOpportunityThunk(opportunityId));
    }
  }, [dispatch, opportunityId]);

  const buttonName = "Update Opportunity";

  if (!opportunity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-opportunity-container">
      <h1>Update Opportunity #{opportunityId}</h1>
      <CreateOpportunityForm
        updatingOpportunity={opportunity}
        buttonName={buttonName}
      />
    </div>
  );
};

export default UpdateOpportunity;
