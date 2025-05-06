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
    [], // Use orgCode as the query parameter
    {
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
          />
        )}
      </div>
    </BasicLayout>
  );
}
