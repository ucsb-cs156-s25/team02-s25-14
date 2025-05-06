import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBOrganizationForm-orgTranslationShort"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const ucsbOrganization = {
      orgCode: "123",
      orgTranslationShort: "Res Hall Assoc",
      orgTranslation: "Residence Halls Association",
      inactive: false,
    };

    axiosMock
      .onPost("/api/ucsborganizations/post")
      .reply(202, ucsbOrganization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBOrganizationForm-orgTranslationShort"),
      ).toBeInTheDocument();
    });

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const orgTranslationField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslation",
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgCodeField, {
      target: { value: "123" },
    });
    fireEvent.change(orgTranslationShortField, {
      target: { value: "Res Hall Assoc" },
    });
    fireEvent.change(orgTranslationField, {
      target: { value: "Residence Halls Association" },
    });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    // Verify the parameters sent in the request
    const postRequest = axiosMock.history.post[0];
    expect(postRequest).toBeDefined();

    expect(postRequest.params).toEqual({
      orgCode: "123",
      orgTranslationShort: "Res Hall Assoc",
      orgTranslation: "Residence Halls Association",
      inactive: false,
    });

    expect(mockToast).toBeCalledWith(
      "New UCSB Organization Created - orgCode: 123 orgTranslationShort: Res Hall Assoc",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });
  });
});
