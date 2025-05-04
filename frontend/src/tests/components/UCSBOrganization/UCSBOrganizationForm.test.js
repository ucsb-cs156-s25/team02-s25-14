import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByText(/Org Translation Short/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a UCSBOrganization", async () => {
    const initialContents = {
      orgCode: "RHA",
      orgTranslationShort: "Res Hall Assoc",
      orgTranslation: "Residence Halls Association",
      inactive: false,
    };

    render(
      <Router>
        <UCSBOrganizationForm initialContents={initialContents} />
      </Router>,
    );
    await screen.findByTestId(/UCSBOrganizationForm-orgCode/);
    expect(screen.getByText(/Org Code/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue(
      "RHA",
    );
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");
    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const orgTranslationField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslation",
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgTranslationShortField, { target: { value: "" } });
    fireEvent.change(orgTranslationField, { target: { value: "" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Org Translation Short is required./);
    await screen.findByText(/Org Translation is required./);
  });

  test("shows error when orgTranslationShort exceeds max length", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>
    );
  
    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort"
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
  
    // Input exceeding max length
    fireEvent.change(orgTranslationShortField, {
      target: { value: "A".repeat(31) }, // 31 characters, exceeding the max length of 30
    });
    fireEvent.click(submitButton);
  
    // Expect error message
    await screen.findByText(/Max length 30 characters/);
  });

  test("does not show error when orgTranslationShort is exactly max length", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>
    );
  
    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort"
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
  
    // Input exactly at max length
    fireEvent.change(orgTranslationShortField, {
      target: { value: "A".repeat(30) }, // 30 characters
    });
    fireEvent.click(submitButton);
  
    // Expect no error message
    expect(
      screen.queryByText(/Max length 30 characters/)
    ).not.toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBOrganizationForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");

    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const orgTranslationField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslation",
    );
    const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgTranslationShortField, {
      target: { value: "Res Hall Assoc" },
    });
    fireEvent.change(orgTranslationField, {
      target: { value: "Residence Halls Association" },
    });
    fireEvent.click(inactiveField);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Org Translation Short is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Org Translation is required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-cancel");
    const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
