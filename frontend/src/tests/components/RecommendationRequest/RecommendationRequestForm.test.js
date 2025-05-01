import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "../../../fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn(); // mock the navigate function

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const queryClient = new QueryClient();

describe("RecommendationRequestForm tests", () => {
  test("renders correctly with no contents", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/requester Email/);
    await screen.findByText(/Professor Email/);
    await screen.findByText(/Explanation/);
    await screen.findByText(/Date Requested/);
    await screen.findByText(/Date Needed/);
    expect(screen.getByLabelText("Done")).toBeInTheDocument();
    await screen.findByText(/Create/);
  });

  test("renders correctly with contents", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestFixtures.oneRequest}
        />
      </Router>,
    );

    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");

    const doneCheckbox = screen.getByTestId("RecommendationRequestForm-done");
    expect(doneCheckbox).toBeChecked();
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "" } });
    fireEvent.change(professorEmailField, { target: { value: "" } });
    fireEvent.change(explanationField, { target: { value: "" } });
    fireEvent.change(dateRequestedField, { target: { value: "" } });
    fireEvent.change(dateNeededField, { target: { value: "" } });
    fireEvent.click(submitButton);

    await screen.findByText(/requester Email is required./);
    await screen.findByText(/Professor Email is required./);
    await screen.findByText(/Explanation is required./);
    await screen.findByText(/Date Requested is required./);
    await screen.findByText(/Date Needed is required./);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/requester Email is required./);
    expect(
      screen.getByText(/Professor Email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");

    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "test@ucsb.edu" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(explanationField, {
      target: { value: "test explanation" },
    });
    fireEvent.change(dateRequestedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.click(doneField);
    expect(doneField).toBeChecked();
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/requester Email is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Professor Email is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Requested is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Needed is required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-cancel");
    const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("Email validation works", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");

    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "" } }); // email is empty
    fireEvent.change(professorEmailField, { target: { value: "" } });
    fireEvent.click(submitButton);

    await screen.findByText(/requester Email is required./);
    await screen.findByText(/Professor Email is required./);

    fireEvent.change(requesterEmailField, {
      target: { value: "valid@ucsb.edu" },
    }); // email is valid
    fireEvent.change(professorEmailField, {
      target: { value: "valid@ucsb.edu" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/requester Email is required./),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/Professor Email is required./),
      ).not.toBeInTheDocument();
    });
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/requester Email is required./);
    expect(
      screen.getByText(/Professor Email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required./)).toBeInTheDocument();
  });
});
