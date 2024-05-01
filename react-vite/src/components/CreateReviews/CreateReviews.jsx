import CreateNewReview from "../ReviewForm/ReviewForm";

const CreateReview = () => {
  const buttonName = "Submit Review";

  const review = {
    description: "",
    rating: "",
    verified_booking: "",
  };

  return (
    <>
      <h1>Add a Review</h1>
      <div>
        <CreateNewReview updatingReview={review} buttonName={buttonName} />
      </div>
    </>
  );
};

export default CreateReview;
