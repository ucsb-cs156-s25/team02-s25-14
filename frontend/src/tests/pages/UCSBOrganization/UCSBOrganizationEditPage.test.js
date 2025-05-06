import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      orgCode: "RHA",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsborganization", { params: { orgCode: "RHA" } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSB Organization");
      expect(
        screen.queryByTestId("UCSBOrganizationForm-orgCode"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsborganization", { params: { orgCode: "RHA" } })
        .reply(200, {
          orgCode: "RHA",
          orgTranslationShort: "Residence Halls Association",
          orgTranslation: "Residence Halls Association",
          inactive: false,
        });
      axiosMock.onPut("/api/ucsborganization").reply(200, {
        orgCode: "RHA",
        orgTranslationShort: "Residence Halls Association",
        orgTranslation: "Residence Halls Association",
        inactive: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided and orgCode is disabled", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const orgTranslationShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort",
      );
      const orgTranslationField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toBeInTheDocument();
      expect(orgCodeField).toHaveValue("RHA");
      expect(orgCodeField).toBeDisabled();
      expect(orgTranslationShortField).toBeInTheDocument();
      expect(orgTranslationShortField).toHaveValue(
        "Residence Halls Association",
      );
      expect(orgTranslationField).toBeInTheDocument();
      expect(orgTranslationField).toHaveValue("Residence Halls Association");
      expect(inactiveField).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(orgTranslationShortField, {
        target: { value: "Residence Halls Association" },
      });
      fireEvent.change(orgTranslationField, {
        target: { value: "Residence Halls Association" },
      });
      fireEvent.click(inactiveField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Organization Updated - orgCode: RHA orgTranslationShort: Residence Halls Association orgTranslation: Residence Halls Association inactive: true",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ orgCode: "RHA" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          orgCode: "RHA",
          orgTranslationShort: "Residence Halls Association",
          orgTranslation: "Residence Halls Association",
          inactive: true,
        }),
      );
    });

    test("Changes when you click Update and orgCode remains disabled", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const orgTranslationShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort",
      );
      const orgTranslationField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toHaveValue("RHA");
      expect(orgCodeField).toBeDisabled();
      expect(orgTranslationShortField).toHaveValue(
        "Residence Halls Association",
      );
      expect(orgTranslationField).toHaveValue("Residence Halls Association");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(orgTranslationShortField, {
        target: { value: "Residence Halls Association" },
      });
      fireEvent.change(orgTranslationField, {
        target: { value: "Residence Halls Association" },
      });
      fireEvent.click(inactiveField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Organization Updated - orgCode: RHA orgTranslationShort: Residence Halls Association orgTranslation: Residence Halls Association inactive: true",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });
    });
  });
});
