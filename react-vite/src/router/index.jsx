import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import CreateReview from "../components/CreateReviews/CreateReviews";
import UpdateReview from "../components/UpdateReview/UpdateReview";
import DeleteReview from "../components/DeleteReviews/DeleteReviews";
import AllOpportunities from "../components/LandingPage/LandingPage";
import OpportunityDetailsPage from "../components/OpportunityDetails/OpportunityDetails";
import OpportunityReviews from "../components/OpportunityReviews/OpportunityReviews";
import OpportunityManagement from "../components/OpportunityManagement/OpportunityManagement";
import CartManagement from "../components/Cart/Cart";
import Layout from "./Layout";
import UpdateOpportunity from "../components/OpportunityForm/UpdateOpportunity";
import AddOpportunity from "../components/OpportunityForm/AddOpportunity";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/",
        element: <AllOpportunities />,
      },
      {
        path: "opportunities/:opportunityId",
        element: <OpportunityDetailsPage />,
      },
      {
        path: "/manage",
        element: <OpportunityManagement />,
      },
      {
        path: "/opportunities/manage/new",
        element: <AddOpportunity />,
      },
      {
        path: "/opportunities/manage/:opportunityId/edit",
        element: <UpdateOpportunity />,
      },
      {
        path: "opportunities/:opportunityId/reviews",
        element: <OpportunityReviews />,
      },
      {
        path: "opportunities/:opportunityId/reviews/new",
        element: <CreateReview />,
      },
      {
        path: "reviews/:reviewId/edit",
        element: <UpdateReview />,
      },
      {
        path: "reviews/:reviewId/delete",
        element: <DeleteReview />,
      },
      {
        path: "carts",
        element: <CartManagement />,
      },
      {
        path: "*",
        element: <h1>Page not found</h1>,
      },
    ],
  },
]);
