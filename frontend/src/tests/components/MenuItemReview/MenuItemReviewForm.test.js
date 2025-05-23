import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Item Id",
    "Reviewer Email",
    "Stars",
    "Date Reviewed (in UTC)",
    "Comments",
  ];
  const testId = "MenuItemReviewForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={menuItemReviewFixtures.oneReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(screen.getByLabelText(`Item Id`)).toBeInTheDocument(
      menuItemReviewFixtures.oneReview.itemId,
    );
    expect(screen.getByLabelText(`Reviewer Email`)).toBeInTheDocument(
      menuItemReviewFixtures.oneReview.reviewerEmail,
    );
    expect(screen.getByText(`Stars`)).toBeInTheDocument(
      menuItemReviewFixtures.oneReview.stars,
    );
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("shows error if stars is less than 1 or greater than 5", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    const starsInput = screen.getByTestId("MenuItemReviewForm-stars");
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    fireEvent.change(starsInput, { target: { value: "0" } });
    fireEvent.blur(starsInput); // trigger validation

    await waitFor(() => {
      expect(screen.getByText(/Stars must be at least 1./)).toBeInTheDocument();
    });

    fireEvent.change(starsInput, { target: { value: "6" } });
    fireEvent.blur(starsInput);

    await waitFor(() => {
      expect(screen.getByText(/Stars must be at most 5./)).toBeInTheDocument();
    });
  });

  test("Email validation works", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByTestId("MenuItemReviewForm-reviewerEmail");

    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );

    fireEvent.change(reviewerEmailField, { target: { value: "" } });

    await screen.findByText(/Reviewer Email is required./);

    fireEvent.change(reviewerEmailField, {
      target: { value: "valid@ucsb.edu" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/Reviewer Email is required./),
      ).not.toBeInTheDocument();
    });
  });

  test("rejects emails that pass without start/end anchors", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const submitButton = screen.getByText(/Create/);

    const invalidEmails = [
      " abc@ucsb.edu", // leading space (fails without ^)
      "abc@ucsb.edu extra", // trailing text (fails without $)
      "hello abc@ucsb.edu", // prefix text
      "abc@ucsb.edu\n", // newline at end
    ];

    for (const email of invalidEmails) {
      fireEvent.change(reviewerEmailField, { target: { value: email } });
      fireEvent.click(submitButton);

      await screen.findByText(/Reviewer Email must be a valid email address/);
    }
  });

  test("shows error for invalid email format", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const submitButton = screen.getByText(/Create/);

    fireEvent.change(reviewerEmailField, {
      target: { value: "abc@ucsb.edu extra" }, // would pass if `$` is missing
    });

    fireEvent.click(submitButton);

    await screen.findByText(/Reviewer Email must be a valid email address/);
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Item Id is required/);
    expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required/)).toBeInTheDocument();

    const commentsInput = screen.getByTestId(`${testId}-comments`);
    fireEvent.change(commentsInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });
});
