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
    // Stryker disable next-line all : don't test internal caching of React Query
    [orgCode], // Use orgCode as the query parameter
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsborganizations`,
      params: {
        orgCode, // Pass orgCode to the backend
      },
    },
  );

  const objectToAxiosPutParams = (ucsbOrganization) => ({
    url: "/api/ucsborganizations",
    method: "PUT",
    params: {
      orgCode: ucsbOrganization.orgCode,
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
    [orgCode], // Use orgCode in the cache key
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };



  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />;
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
            disabledFields={{ orgCode: true }}
          />
        )}
      </div>
    </BasicLayout>
  );
}
