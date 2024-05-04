import CreateOpportunityForm from "./OpportunitiesForm";

const AddOpportunity = () => {
  const buttonName = "List New Opportunity";

  const newOpportunity = {
    title: "",
    rate: "",
    type: "",
    // image: "",
    description: "",
  };

  return (
    <div className="list-opportunity-container">
      <h1>Create a New Opportunity Listing</h1>
      <CreateOpportunityForm
        updatingOpportunity={newOpportunity}
        buttonName={buttonName}
      />
    </div>
  );
};

export default AddOpportunity;
