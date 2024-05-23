import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewOpportunityThunk,
  editOppThunk,
} from "../../redux/opportunities";
import "./OpportunityForm.css";

const typesToImages = {
  "Birthday shoutouts":
    "https://capstone-nexus.s3.us-west-1.amazonaws.com/birthday-shoutouts-tile.png",
  Endorsements:
    "https://capstone-nexus.s3.us-west-1.amazonaws.com/US-sports-sponsorship-deals.png",
  Autographs:
    "https://capstone-nexus.s3.us-west-1.amazonaws.com/PhotoRoom_20230216_075330_1500x.webp",
  Appearances:
    "https://capstone-nexus.s3.us-west-1.amazonaws.com/51772bbf-4707-4d35-8819-edfdda1d4d20-FOB-dicks-opening_21.webp",
};

const CreateOpportunityForm = ({ buttonName, updatingOpportunity }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { opportunityId } = useParams();

  const [formData, setFormData] = useState({
    title: updatingOpportunity?.title || "",
    rate: updatingOpportunity?.rate || "",
    type: updatingOpportunity?.type || "",
    description: updatingOpportunity?.description || "",
    image: typesToImages[updatingOpportunity?.type] || "",
  });
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (updatingOpportunity) {
  //     setFormData({
  //       title: updatingOpportunity.title,
  //       rate: updatingOpportunity.rate,
  //       type: updatingOpportunity.type,
  //       description: updatingOpportunity.description,
  //       image: typesToImages[updatingOpportunity.type],
  //     });
  //   }
  // }, [updatingOpportunity]);

  useEffect(() => {
    if (updatingOpportunity) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: updatingOpportunity.title,
        rate: updatingOpportunity.rate,
        type: updatingOpportunity.type,
        description: updatingOpportunity.description,
        image: typesToImages[updatingOpportunity.type] || "", // Set image based on type
      }));
    }
  }, [updatingOpportunity]);

  useEffect(() => {
    validateFormData();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "type" && { image: typesToImages[value] }),
    }));
  };

  const validateFormData = () => {
    const newErrors = {};
    if (formData.title.length <= 10) {
      newErrors.title = "Title must be greater than 10 characters.";
    }
    if (formData.description.length <= 10) {
      newErrors.description = "Description must be greater than 20 characters.";
    }
    if (formData.rate <= 0) {
      newErrors.rate = "Rate must be a positive number.";
    }
    if (formData.type <= 0) {
      newErrors.type = "Type must be declared.";
    }
    setErrors(newErrors);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (Object.keys(errors).length > 0) {
  //     return; // Prevent form submission if errors are present
  //   }

  //   try {
  //     if (!opportunityId) {
  //       await dispatch(addNewOpportunityThunk(formData));
  //       nav("/manage");
  //       alert("New opportunity added! Please return to your management page.");
  //     } else {
  //       await dispatch(editOppThunk(opportunityId, formData));
  //       nav(`/opportunities/${opportunityId}`);
  //       alert("Opportunity updated successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Failed to save the opportunity:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      alert("Please correct the errors before submitting.");
      return; // Prevent form submission if errors are present
    }

    try {
      if (!opportunityId) {
        const result = await dispatch(addNewOpportunityThunk(formData));
        if (result.success) {
          nav("/manage");
          alert(
            "New opportunity added! Please return to your management page."
          );
        } else {
          alert(result.error);
        }
      } else {
        const result = await dispatch(editOppThunk(opportunityId, formData));
        if (result.success) {
          nav(`/opportunities/${opportunityId}`);
          // alert("Opportunity updated successfully!");
        } else {
          alert(result.error);
        }
      }
    } catch (error) {
      console.error("Failed to save the opportunity:", error);
    }
  };

  const isButtonDisabled =
    Object.keys(errors).length > 0 ||
    !formData.title ||
    !formData.rate ||
    !formData.type ||
    !formData.description;

  return (
    <form onSubmit={handleSubmit} className="create-update-opportunity-form">
      <label>
        Title:
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
      </label>
      <label>
        Rate:
        <input
          type="number"
          value={formData.rate}
          onChange={(e) => handleInputChange("rate", e.target.value)}
        />
        {errors.rate && <p style={{ color: "red" }}>{errors.rate}</p>}
      </label>
      <label className="type-container">
        Type:
        <select
          value={formData.type}
          onChange={(e) => handleInputChange("type", e.target.value)}
        >
          <option value="">Select Type</option>
          {Object.keys(typesToImages).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <p style={{ color: "red" }}>{errors.type}</p>}
      </label>
      {formData.image && (
        <div>
          <img
            src={formData.image}
            alt="Type Preview"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
      )}
      <textarea
        className="body-textarea"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        placeholder="Enter opportunity description..."
        rows={7}
      />
      <div className="Opportunity-Btn-container">
        <button
          type="submit"
          className="Opportunity-Submit-btn"
          disabled={isButtonDisabled}
        >
          {buttonName}
        </button>
        {opportunityId && (
          <button
            className="back-to-opportunity"
            type="button"
            onClick={() => nav(`/opportunities/${opportunityId}`)}
          >
            Back to Opportunity
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateOpportunityForm;
