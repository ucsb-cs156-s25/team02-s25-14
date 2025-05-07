import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

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
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/ucsborganizations", { params: { orgCode: "RHA" } })
      .reply(200, {
        orgCode: "RHA",
        orgTranslationShort: "Res Hall Assoc",
        orgTranslation: "Residence Halls Association",
        inactive: false,
      });
    axiosMock.onPut("/api/ucsborganizations").reply(200, {
      orgCode: "RHA",
      orgTranslationShort: "Updated Short",
      orgTranslation: "Updated Translation",
      inactive: true,
    });
  });

  test("renders UCSBOrganizationTable with data", async () => {
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
    const inactiveCheckbox = screen.getByTestId(
      "UCSBOrganizationForm-inactive",
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    expect(orgCodeField).toBeInTheDocument();
    expect(orgCodeField).toHaveValue("RHA");
    expect(orgCodeField).toBeDisabled();
    expect(orgTranslationShortField).toBeInTheDocument();
    expect(orgTranslationShortField).toHaveValue("Res Hall Assoc");
    expect(orgTranslationField).toBeInTheDocument();
    expect(orgTranslationField).toHaveValue("Residence Halls Association");
    expect(inactiveCheckbox).not.toBeChecked();
    expect(submitButton).toHaveTextContent("Update");
  });

  test("uses correct URL with orgCode in query string", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const getRequest = axiosMock.history.get.find((req) =>
        req.url.includes("/api/ucsborganizations"),
      );
      expect(getRequest).toBeDefined();
      expect(getRequest.url).toContain("/api/ucsborganizations");
      expect(getRequest.params).toEqual({ orgCode: "RHA" });
      expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).toHaveValue(
        "RHA",
      );
      expect(getRequest.method).toBe("get");
    });
  });

  test("calls mutate and invalidates correct cache key", async () => {
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const orgTranslationShortField = await screen.findByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const orgTranslationField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslation",
    );
    const inactiveCheckbox = screen.getByTestId(
      "UCSBOrganizationForm-inactive",
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgTranslationShortField, {
      target: { value: "Updated Short" },
    });
    fireEvent.change(orgTranslationField, {
      target: { value: "Updated Translation" },
    });
    fireEvent.click(inactiveCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toBeCalled();
      expect(mockNavigate).toBeCalled();
    });

    // ✅ Now spy works correctly
    expect(invalidateSpy).toHaveBeenCalledWith(["RHA"]);
  });

  test("handles form submission and updates data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // await screen.findByTestId("UCSBOrganizationForm-orgCode");

    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const orgTranslationField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslation",
    );
    const inactiveCheckbox = screen.getByTestId(
      "UCSBOrganizationForm-inactive",
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgTranslationShortField, {
      target: { value: "Updated Short" },
    });
    fireEvent.change(orgTranslationField, {
      target: { value: "Updated Translation" },
    });
    fireEvent.click(inactiveCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockToast).toBeCalled());
    expect(mockToast).toBeCalledWith(
      "UCSB Organization Updated - orgCode: RHA orgTranslationShort: Updated Short",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });

    expect(axiosMock.history.put.length).toBe(1);
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
      orgCode: "RHA",
      orgTranslationShort: "Updated Short",
      orgTranslation: "Updated Translation",
      inactive: true,
    });
    expect(axiosMock.history.put[0].params).toEqual({ orgCode: "RHA" });
  });

  test("renders button with correct label", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const submitButton = await screen.findByTestId(
      "UCSBOrganizationForm-submit",
    );
    expect(submitButton).toHaveTextContent("Update");
  });
});
