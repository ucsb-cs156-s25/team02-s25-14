export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams();
  console.log("orgCode:", orgCode); // Debugging

  const {
    data: ucsbOrganization,
    error: _error,
    status: _status,
  } = useBackend(
    [`/api/ucsborganizations?orgCode=${orgCode}`],
    {
      method: "GET",
      url: `/api/ucsborganizations`,
      params: {
        orgCode,
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
    [`/api/ucsborganizations?orgCode=${orgCode}`],
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
    console.error("Error fetching UCSB Organization:", _error); // Debugging
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