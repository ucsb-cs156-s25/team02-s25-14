import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({ storybook = false }) {
  const objectToAxiosParams = (recommendationRequest) => ({
    url: "/api/recommendation-requests/post",
    method: "POST",
    params: {
      requestorEmail: recommendationRequest.requestorEmail,
      professorEmail: recommendationRequest.professorEmail,
      explanation: recommendationRequest.explanation,
      dateRequested: recommendationRequest.dateRequested,
      dateNeeded: recommendationRequest.dateNeeded,
      done: recommendationRequest.done,
    },
  });

  const onSuccess = (recommendationRequest) => {
    toast(
      `New recommendationRequest Created - id: ${recommendationRequest.id}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/recommendation-requests/all"],
  );

  const { isSuccess } = mutation;

  const fixDateFormat = (str) => (str.length === 16 ? `${str}:00` : str); // adding :00 to the end of the string to make it a valid date

  const onSubmit = async (data) => {
    mutation.mutate({
      ...data,  
      dateRequested: fixDateFormat(data.dateRequested),
      dateNeeded: fixDateFormat(data.dateNeeded),
      done: String(data.done),
    });
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Recommendation Request</h1>

        <RecommendationRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
