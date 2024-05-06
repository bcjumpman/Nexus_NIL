// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   addNewOpportunityThunk,
//   editOppThunk,
// } from "../../redux/opportunities";
// import "./OpportunityForm.css";

// const CreateOpportunityForm = ({ buttonName, updatingOpportunity }) => {
//   const nav = useNavigate();
//   const dispatch = useDispatch();
//   const { opportunityId } = useParams();

//   const [title, setTitle] = useState(updatingOpportunity?.title || "");
//   const [rate, setRate] = useState(updatingOpportunity?.rate || "");
//   const [type, setType] = useState(updatingOpportunity?.category || "");
//   const [description, setDescription] = useState(
//     updatingOpportunity?.description || ""
//   );
//   const [validations, setValidations] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     if (updatingOpportunity) {
//       setTitle(updatingOpportunity.title);
//       setRate(updatingOpportunity.rate);
//       setType(updatingOpportunity.type);
//       setDescription(updatingOpportunity.description);
//     }
//   }, [updatingOpportunity]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("rate", parseFloat(rate));
//     formData.append("type", type);
//     formData.append("description", description);

//     // if (image_url !== null) {
//     //   formData.append("image_url", image_url);
//     // } else {
//     //   formData.image_url = updatingOpportunity.image;
//     // }

//     setSubmitted(true);

//     if (title.length <= 10) {
//       setValidations({
//         ...validations,
//         description: "Your title must be greater than 10 characters.",
//       });
//       return;
//     }

//     if (description.length <= 20) {
//       setValidations({
//         ...validations,
//         description: "Your description must be greater than 20 characters.",
//       });
//       return;
//     }

//     if (rate <= 0) {
//       setValidations({
//         ...validations,
//         description: "Your rate cannot be negative.",
//       });
//       return;
//     }

//     if (!opportunityId) {
//       await dispatch(addNewOpportunityThunk(formData));
//       nav("/manage");
//     } else {
//       await dispatch(editOppThunk(opportunityId, formData));
//       nav(`/opportunities/${opportunityId}`);
//     }
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit}
//         encType="multipart/form-data"
//         className="create-update-opportunity-form"
//       >
//         {submitted && validations.description && (
//           <p style={{ color: "red" }}>{validations.description}</p>
//         )}
//         <label>
//           Title:
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </label>
//         <label>
//           Rate:
//           <input
//             type="number"
//             value={rate}
//             onChange={(e) => setRate(e.target.value)}
//           />
//         </label>
//         <label>
//           Type:
//           <input
//             type="text"
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//           />
//         </label>
//         <textarea
//           className="body-textarea"
//           type="text"
//           name="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Enter opportunity description..."
//           rows={7}
//           cols={70}
//         />
//         <div className="Opportunity-Btn-container">
//           <button
//             type="submit"
//             className="Opportunity-Submit-btn"
//             disabled={
//               submitted &&
//               (description.length <= 10 ||
//                 !title ||
//                 !rate ||
//                 !type ||
//                 validations)
//             }
//           >
//             {buttonName}
//           </button>
//           {opportunityId && (
//             <button
//               className="back-to-opportunity"
//               onClick={() => nav(`/opportunities/${opportunityId}`)}
//             >
//               Back to Opportunity
//             </button>
//           )}
//         </div>
//       </form>
//     </>
//   );
// };

// export default CreateOpportunityForm;

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   addNewOpportunityThunk,
//   editOppThunk,
// } from "../../redux/opportunities";
// import "./OpportunityForm.css";

// const CreateOpportunityForm = ({ buttonName, updatingOpportunity }) => {
//   const nav = useNavigate();
//   const dispatch = useDispatch();
//   const { opportunityId } = useParams();

//   const [title, setTitle] = useState(updatingOpportunity?.title || "");
//   const [rate, setRate] = useState(updatingOpportunity?.rate || "");
//   const [type, setType] = useState(updatingOpportunity?.type || "");
//   const [description, setDescription] = useState(
//     updatingOpportunity?.description || ""
//   );
//   const [validations, setValidations] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (updatingOpportunity) {
//       setTitle(updatingOpportunity.title);
//       setRate(updatingOpportunity.rate);
//       setType(updatingOpportunity.type);
//       setDescription(updatingOpportunity.description);
//     }
//   }, [updatingOpportunity]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitted(true);

//     // Validations
//     if (title.length <= 10) {
//       return setValidations({
//         ...validations,
//         title: "Title must be greater than 10 characters.",
//       });
//     }

//     if (description.length <= 20) {
//       return setValidations({
//         ...validations,
//         description: "Description must be greater than 20 characters.",
//       });
//     }

//     if (rate <= 0) {
//       return setValidations({
//         ...validations,
//         rate: "Rate must be a positive number.",
//       });
//     }

//     const formData = { title, rate, type, description };
//     try {
//       if (!opportunityId) {
//         await dispatch(addNewOpportunityThunk(formData));
//         nav("/manage");
//       } else {
//         await dispatch(editOppThunk(opportunityId, formData));
//         nav(`/opportunities/${opportunityId}`);
//       }
//     } catch (error) {
//       setError("An error occurred while updating the opportunity.");
//       console.error("Failed to save the opportunity:", error);
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="create-update-opportunity-form">
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <label>
//           Title:
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           {validations.title && (
//             <p style={{ color: "red" }}>{validations.title}</p>
//           )}
//         </label>
//         <label>
//           Rate:
//           <input
//             type="number"
//             value={rate}
//             onChange={(e) => setRate(e.target.value)}
//           />
//           {validations.rate && (
//             <p style={{ color: "red" }}>{validations.rate}</p>
//           )}
//         </label>
//         <label>
//           Type:
//           <input
//             type="text"
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//           />
//         </label>
//         <textarea
//           className="body-textarea"
//           name="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Enter opportunity description..."
//           rows={7}
//         />
//         <div className="Opportunity-Btn-container">
//           <button type="submit" className="Opportunity-Submit-btn">
//             {buttonName}
//           </button>
//           {opportunityId && (
//             <button
//               className="back-to-opportunity"
//               type="button"
//               onClick={() => nav(`/opportunities/${opportunityId}`)}
//             >
//               Back to Opportunity
//             </button>
//           )}
//         </div>
//       </form>
//     </>
//   );
// };

// export default CreateOpportunityForm;

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   addNewOpportunityThunk,
//   editOppThunk,
// } from "../../redux/opportunities";
// import "./OpportunityForm.css";

// const typesToImages = {
//   "Birthday shoutouts":
//     "https://capstone-nexus.s3.us-west-1.amazonaws.com/birthday-shoutouts-tile.png",
//   Endorsements:
//     "https://capstone-nexus.s3.us-west-1.amazonaws.com/US-sports-sponsorship-deals.png",
//   Autographs:
//     "https://capstone-nexus.s3.us-west-1.amazonaws.com/PhotoRoom_20230216_075330_1500x.webp",
//   Appearances:
//     "https://capstone-nexus.s3.us-west-1.amazonaws.com/51772bbf-4707-4d35-8819-edfdda1d4d20-FOB-dicks-opening_21.webp",
// };

// const CreateOpportunityForm = ({ buttonName, updatingOpportunity }) => {
//   const nav = useNavigate();
//   const dispatch = useDispatch();
//   const { opportunityId } = useParams();

//   const [title, setTitle] = useState(updatingOpportunity?.title || "");
//   const [rate, setRate] = useState(updatingOpportunity?.rate || "");
//   const [type, setType] = useState(updatingOpportunity?.type || "");
//   const [description, setDescription] = useState(
//     updatingOpportunity?.description || ""
//   );
//   const [image, setImage] = useState(
//     typesToImages[updatingOpportunity?.type] || ""
//   );
//   const [validations, setValidations] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (updatingOpportunity) {
//       setTitle(updatingOpportunity.title);
//       setRate(updatingOpportunity.rate);
//       setType(updatingOpportunity.type);
//       setImage(typesToImages[updatingOpportunity.type]);
//       setDescription(updatingOpportunity.description);
//     }
//   }, [updatingOpportunity]);

//   const handleTypeChange = (e) => {
//     const selectedType = e.target.value;
//     setType(selectedType);
//     setImage(typesToImages[selectedType]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//     setError(""); // Resetting previous errors
//     setValidations({}); // Clear previous validations

//     let hasError = false; // Flag to track if there's an error

//     // Validate inputs
//     if (title.length <= 10) {
//       setValidations((v) => ({
//         ...v,
//         title: "Title must be greater than 10 characters.",
//       }));
//       hasError = true;
//     }

//     if (description.length <= 20) {
//       setValidations((v) => ({
//         ...v,
//         description: "Description must be greater than 20 characters.",
//       }));
//       hasError = true;
//     }

//     if (rate <= 0) {
//       setValidations((v) => ({
//         ...v,
//         rate: "Rate must be a positive number.",
//       }));
//       hasError = true;
//     }

//     if (hasError) return; // Stop the form submission if there are errors

//     const formData = { title, rate, type, description, image };
//     try {
//       if (!opportunityId) {
//         await dispatch(addNewOpportunityThunk(formData));
//         nav("/manage");
//         alert("New opportunity added! Click the home button to view.");
//       } else {
//         await dispatch(editOppThunk(opportunityId, formData));
//         nav(`/opportunities/${opportunityId}`);
//         alert("Opportunity updated successfully!");
//       }
//     } catch (error) {
//       setError(
//         "An error occurred while updating the opportunity: " + error.message
//       );
//       console.error("Failed to save the opportunity:", error);
//     }
//   };

//   // Check if there are any validations or error messages
//   const isButtonDisabled = () => {
//     return error || Object.keys(validations).length > 0;
//   };

//   return (
//     <form onSubmit={handleSubmit} className="create-update-opportunity-form">
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <label>
//         Title:
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         {validations.title && (
//           <p style={{ color: "red" }}>{validations.title}</p>
//         )}
//       </label>
//       <label>
//         Rate:
//         <input
//           type="number"
//           value={rate}
//           onChange={(e) => setRate(e.target.value)}
//         />
//         {validations.rate && <p style={{ color: "red" }}>{validations.rate}</p>}
//       </label>
//       <label>
//         Type:
//         <select value={type} onChange={handleTypeChange}>
//           <option value="">Select Type</option>
//           {Object.keys(typesToImages).map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </label>
//       {image && (
//         <div>
//           <img
//             src={image}
//             alt="Type Preview"
//             style={{ width: "100px", height: "auto" }}
//           />
//         </div>
//       )}
//       <textarea
//         className="body-textarea"
//         name="description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Enter opportunity description..."
//         rows={7}
//       />
//       <div className="Opportunity-Btn-container">
//         <button
//           type="submit"
//           className="Opportunity-Submit-btn"
//           disabled={isButtonDisabled()}
//         >
//           {buttonName}
//         </button>
//         {opportunityId && (
//           <button
//             className="back-to-opportunity"
//             type="button"
//             onClick={() => nav(`/opportunities/${opportunityId}`)}
//           >
//             Back to Opportunity
//           </button>
//         )}
//       </div>
//     </form>
//   );
// };

// export default CreateOpportunityForm;

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

  useEffect(() => {
    if (updatingOpportunity) {
      setFormData({
        title: updatingOpportunity.title,
        rate: updatingOpportunity.rate,
        type: updatingOpportunity.type,
        description: updatingOpportunity.description,
        image: typesToImages[updatingOpportunity.type],
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return; // Prevent form submission if errors are present
    }

    try {
      if (!opportunityId) {
        await dispatch(addNewOpportunityThunk(formData));
        nav("/manage");
        alert("New opportunity added! Please return to your management page.");
      } else {
        await dispatch(editOppThunk(opportunityId, formData));
        nav(`/opportunities/${opportunityId}`);
        alert("Opportunity updated successfully!");
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
      <label>
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
