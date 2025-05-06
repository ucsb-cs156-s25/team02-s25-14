import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { BrowserRouter as Router } from "react-router-dom";

import { toast } from "react-toastify";

const mockSubmitAction = jest.fn();

jest.mock("react-toastify", () => {
  return {
    toast: jest.fn(),
  };
});

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
    expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue("RHA");
    expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).not.toHaveValue("");
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
      </Router>,
    );

    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgTranslationShortField, {
      target: { value: "A".repeat(31) }, // 31 characters, over max length of 30
    });
    fireEvent.click(submitButton);

    await screen.findByText(/Max length 30 characters/);
  });

  test("does not show error when orgTranslationShort is exactly max length", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgTranslationShortField, {
      target: { value: "A".repeat(30) }, // 30 characters
    });
    fireEvent.click(submitButton);

    expect(
      screen.queryByText(/Max length 30 characters/),
    ).not.toBeInTheDocument();
  });

  test("shows error when orgCode is missing", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
  
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
    fireEvent.click(submitButton);
  
    await screen.findByText(/Org Code is required./);
  });

  test("shows error when orgCode exceeds max length", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
  
    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
  
    fireEvent.change(orgCodeField, { target: { value: "A".repeat(11) } }); // over max length of 10
    fireEvent.click(submitButton);
  
    await screen.findByText(/Max length 10 characters/);
  });

  test("sets defaultValue for orgCode from initialContents", async () => {
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
  
    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    expect(orgCodeField).toHaveValue("RHA");
  });

  test("cancel button navigates back", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
  
    const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");
    fireEvent.click(cancelButton);
  
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  test("orgCode field has empty string defaultValue when initialContents is missing", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>
    );
  
    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
  
    expect(orgCodeField).toHaveValue("");
  });
  

  test("orgCode field is editable when editing", async () => {
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
  
    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
  
    expect(orgCodeField).not.toBeDisabled();
    fireEvent.change(orgCodeField, { target: { value: "NEWCODE" } });
    expect(orgCodeField).toHaveValue("NEWCODE");
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

    expect(
      screen.queryByText(/Org Translation Short is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Org Translation is required./),
    ).not.toBeInTheDocument();
  });

  test("orgCode field is editable when editing", async () => {
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

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    expect(orgCodeField).not.toBeDisabled();
  });

  test("orgCode field is editable when creating", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    expect(orgCodeField).not.toBeDisabled();
  });

  test("cancel button navigates back", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");
    fireEvent.click(cancelButton);
  });

  test("data-testid attributes are correctly set", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    expect(screen.getByTestId("UCSBOrganizationForm-cancel")).toBeInTheDocument();
    expect(screen.getByTestId("UCSBOrganizationForm-submit")).toBeInTheDocument();
  });

  test("renders with empty initialContents", () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>
    );

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    expect(orgCodeField).toHaveValue("");
  });

  test("renders with null initialContents", () => {
    render(
      <Router>
        <UCSBOrganizationForm initialContents={null} />
      </Router>
    );

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    expect(orgCodeField).toHaveValue("");
  });

  test("renders with undefined initialContents", () => {
    render(
      <Router>
        <UCSBOrganizationForm initialContents={undefined} />
      </Router>
    );

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    expect(orgCodeField).toHaveValue("");
  });

  test("renders with empty object initialContents", () => {
    render(
      <Router>
        <UCSBOrganizationForm initialContents={{}} />
      </Router>
    );

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    expect(orgCodeField).toHaveValue("");
  });
});

test("throws error if orgCode is blank when initialContents has value", () => {
  const initialContents = {
    orgCode: "RHA",
    orgTranslationShort: "test",
    orgTranslation: "test"
  };

  render(
    <Router>
      <UCSBOrganizationForm initialContents={initialContents} />
    </Router>
  );

  const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
  const value = orgCodeField.value;

  if (value === "") {
    throw new Error("Mutation detected: orgCode was blank but should be 'RHA'");
  }

  expect(value).toBe("RHA");
});
