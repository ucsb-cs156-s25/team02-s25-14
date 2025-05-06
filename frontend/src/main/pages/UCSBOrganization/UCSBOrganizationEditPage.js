import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams(); // Use orgCode instead of id

  const {
    data: ucsbOrganization,
    error: _error,
    status: _status,
  } = useBackend(
    [`/api/ucsborganizations?orgCode=${orgCode}`], // Use orgCode as the query parameter
    {
      method: "GET",
      url: `/api/ucsborganizations`,
      params: {
        orgCode, // Pass orgCode to the backend
      },
    },
    console.log("orgCode: ", orgCode)
  );

  const objectToAxiosPutParams = (ucsbOrganization) => ({
    url: "/api/ucsborganizations",
    method: "PUT",
    params: {
      orgCode: ucsbOrganization.orgCode, // Use orgCode instead of id
    },
    data: {
      orgCode: ucsbOrganization.orgCode,
      orgTranslationShort: ucsbOrganization.orgTranslationShort,
      orgTranslation: ucsbOrganization.orgTranslation,
      inactive: ucsbOrganization.inactive,
    },
  });

  const onSuccess = (ucsbOrganization) => {
    toast(
      `UCSB Organization Updated - orgCode: ${ucsbOrganization.orgCode} orgTranslationShort: ${ucsbOrganization.orgTranslationShort}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    [`/api/ucsborganizations?id=${orgCode}`], // Use orgCode in the cache key
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (_status === "loading") {
    return (
      <BasicLayout>
        <div className="pt-2">
          <h1>Loading...</h1>
        </div>
      </BasicLayout>
    );
  }

  if (_error) {
    return (
      <BasicLayout>
        <div className="pt-2">
          <h1>Error</h1>
          <p>Unable to fetch UCSB Organization. Please try again later.</p>
        </div>
      </BasicLayout>
    );
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSB Organization</h1>
        {ucsbOrganization && (
          <UCSBOrganizationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={ucsbOrganization}
          />
        )}
      </div>
    </BasicLayout>
  );
}