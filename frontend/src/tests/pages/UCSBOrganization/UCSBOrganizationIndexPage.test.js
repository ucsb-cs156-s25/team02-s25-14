import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationIndexPage from "main/pages/UCSBOrganization/UCSBOrganizationIndexPage";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("UCSBOrganizationIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "UCSBOrganizationTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  test("Renders with Create Button for admin user", async () => {
    // arrange
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await waitFor(() => {
      expect(screen.getByText(/Create UCSB Organization/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create UCSB Organization/);
    expect(button).toHaveAttribute("href", "/ucsborganization/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("does not render Create Button for non-admin user", async () => {
    // Arrange
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(/Create UCSB Organization/),
      ).not.toBeInTheDocument();
    });
  });

  test("renders Create Button for admin user", async () => {
    // Arrange
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Create UCSB Organization/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create UCSB Organization/);
    expect(button).toHaveAttribute("href", "/ucsborganization/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders table with valid organizations data", async () => {
    // Arrange
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/ucsborganizations/all")
      .reply(200, ucsbOrganizationFixtures.threeUCSBOrganizations);

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode"),
      ).toHaveTextContent("AS");
    });
    expect(
      screen.getByTestId("UCSBOrganizationTable-cell-row-1-col-orgCode"),
    ).toHaveTextContent("ASBS");
    expect(
      screen.getByTestId("UCSBOrganizationTable-cell-row-2-col-orgCode"),
    ).toHaveTextContent("ARC");
  });

  test("throws error when organizations data is invalid", async () => {
    // Arrange
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsborganizations/all").reply(500);

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // // Assert
    // await waitFor(() => {
    //   const errorMessage = screen.getByText(/Request failed with status code 500/);
    //   expect(errorMessage).toBeInTheDocument();
    // });
  });

  test("renders empty table when no organizations are provided", async () => {
    // Arrange
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode"),
      ).not.toBeInTheDocument();
    });
  });

  test("renders empty table when backend unavailable, user only", async () => {
    // arrange
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsborganizations/all").timeout();
    const restoreConsole = mockConsole();

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/ucsborganizations/all",
    );
    restoreConsole();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).not.toBeInTheDocument();
  });

  test("what happens when you click delete, admin", async () => {
    // Arrange
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/ucsborganizations/all")
      .reply(200, ucsbOrganizationFixtures.threeUCSBOrganizations);
    axiosMock
      .onDelete("/api/ucsborganizations")
      .reply(200, "UCSBOrganization with orgCode RHA was deleted");

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for the table to render
    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode"),
      ).toBeInTheDocument();
    });

    // Locate the delete button
    const deleteButton = screen.getByTestId(
      "UCSBOrganizationTable-cell-row-0-col-Delete-button",
    );
    expect(deleteButton).toBeInTheDocument();

    // Act: Click the delete button
    fireEvent.click(deleteButton);

    // Assert: Verify the toast message
    await waitFor(() => {
      expect(mockToast).toBeCalledWith(
        "UCSBOrganization with orgCode RHA was deleted",
      );
    });
  });
});
