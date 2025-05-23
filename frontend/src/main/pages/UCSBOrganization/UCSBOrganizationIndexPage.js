import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationIndexPage() {
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsborganization/create"
          style={{ float: "right" }}
        >
          Create UCSB Organization
        </Button>
      );
    }
  };

  const {
    data: organizations,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsborganizations/all"],
    { method: "GET", url: "/api/ucsborganizations/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSB Organizations</h1>
        <UCSBOrganizationTable
          organizations={organizations}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
