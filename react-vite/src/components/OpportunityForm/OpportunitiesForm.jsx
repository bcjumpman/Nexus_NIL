import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewOpportunityThunk,
  editOppThunk,
} from "../../redux/opportunities";
import "./OpportunityForm.css";

const CreateOpportunityForm = ({ buttonName, updatingOpportunity }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { opportunityId } = useParams();

  const [title, setTitle] = useState(updatingOpportunity?.title || "");
  const [rate, setRate] = useState(updatingOpportunity?.rate || "");
  const [type, setType] = useState(updatingOpportunity?.category || "");
  const [description, setDescription] = useState(
    updatingOpportunity?.description || ""
  );
  const [validations, setValidations] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (updatingOpportunity) {
      setTitle(updatingOpportunity.title);
      setRate(updatingOpportunity.rate);
      setType(updatingOpportunity.type);
      setDescription(updatingOpportunity.description);
    }
  }, [updatingOpportunity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("rate", parseFloat(rate));
    formData.append("type", type);
    formData.append("description", description);

    if (image_url !== null) {
      formData.append("image_url", image_url);
    } else {
      formData.image_url = updatingProduct.image;
    }

    setImageLoading(true);
    setSubmitted(true);

    if (description.length <= 10) {
      setValidations({
        ...validations,
        description: "Your description must be greater than 10 characters.",
      });
      return;
    }

    if (!opportunityId) {
      await dispatch(addNewOpportunityThunk(formData));
      nav("/manage");
    } else {
      await dispatch(editOppThunk(opportunityId, formData));
      nav(`/opportunities/${opportunityId}`);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="create-update-opportunity-form"
      >
        {submitted && validations.description && (
          <p style={{ color: "red" }}>{validations.description}</p>
        )}
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Rate:
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <textarea
          className="body-textarea"
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter opportunity description..."
          rows={7}
          cols={70}
        />
        <div className="Opportunity-Btn-container">
          <button
            type="submit"
            className="Opportunity-Submit-btn"
            disabled={
              submitted &&
              (description.length <= 10 ||
                !title ||
                !rate ||
                !type ||
                validations)
            }
          >
            {buttonName}
          </button>
          {opportunityId && (
            <button
              className="back-to-opportunity"
              onClick={() => nav(`/opportunities/${opportunityId}`)}
            >
              Back to Opportunity
            </button>
          )}
          {imageLoading && <p>Loading...</p>}
        </div>
      </form>
    </>
  );
};

export default CreateOpportunityForm;
