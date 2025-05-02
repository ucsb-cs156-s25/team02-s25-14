import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
      </Router>
    );
    await screen.findByTestId(/HelpRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );
    
    await screen.findByTestId("HelpRequestForm-requestTime");
    const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    // Test invalid patterns for all fields
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Requester email is required./)).toBeInTheDocument();
      expect(screen.getByText(/Team ID is required./)).toBeInTheDocument();
      expect(screen.getByText(/Table or breakout room is required./)).toBeInTheDocument();
      expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
      expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    });
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );
    
    const submitButton = screen.getByTestId("HelpRequestForm-submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Requester email is required./)).toBeInTheDocument();
      expect(screen.getByText(/Team ID is required./)).toBeInTheDocument();
      expect(screen.getByText(/Table or breakout room is required./)).toBeInTheDocument();
      expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
      expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    });
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>
    );

    const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "valid@example.com" } });
    fireEvent.change(teamIdField, { target: { value: "team-123" } });
    fireEvent.change(tableField, { target: { value: "Table 5" } });
    fireEvent.change(requestTimeField, { target: { value: "2024-02-01T14:30" } });
    fireEvent.change(explanationField, { target: { value: "Need help with setup" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Requester email is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Team ID is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Table or breakout room is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Request Time is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  // Enhanced regex validation tests
  test("Validates requestTime ISO format strictly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );

    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    const invalidDates = [
      // Date part variations
      "202-12-31T23:59",         // 3-digit year
      "20244-12-31T23:59",       // 5-digit year
      "2024-13-01T12:00",        // Invalid month
      "2024-00-01T12:00",        // Invalid month
      "2024-12-32T12:00",        // Invalid day
      "2024-02-30T12:00",        // Invalid day for February
      // Time part variations
      "2024-12-31T24:00",        // Invalid hour
      "2024-12-31T23:60",        // Invalid minute
      "2024-12-31T23:59:60",     // Invalid second
      "2024-12-31T23:59:59.ABC", // Invalid milliseconds
      // Format variations
      "2024/12/31T23:59",        // Wrong date separator
      "2024-12-31 23:59",        // Missing T separator
      "2024-12-31T23",           // Missing minutes
      "2024-12-31T23:5",         // Single-digit minute
      "2024-1-31T23:59",         // Single-digit month
      "2024-12-3T23:59",         // Single-digit day
    ];

    for (const date of invalidDates) {
      fireEvent.change(requestTimeField, { target: { value: date } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
      });
      fireEvent.change(requestTimeField, { target: { value: "" } });
    }

    // Test valid format variations
    const validDates = [
      "2024-02-01T14:30",              // Basic valid format
      "2024-12-31T23:59:59",           // With seconds
      "2024-06-15T08:05:30.123",       // With milliseconds
      "2024-07-01T00:00",              // Midnight
      "2024-08-20T12:30:00.000"        // Full precision
    ];

    for (const date of validDates) {
      fireEvent.change(requestTimeField, { target: { value: date } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.queryByText(/Request Time is required./)).not.toBeInTheDocument();
      });
    }
  });
});
