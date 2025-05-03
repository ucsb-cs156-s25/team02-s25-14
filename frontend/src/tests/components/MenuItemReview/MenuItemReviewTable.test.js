import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewTable tests", () => {
  const queryClient = new QueryClient();

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7d038e06 (fixing formatting)
  const expectedHeaders = [
    "id",
    "Item Id",
    "Reviewer Email",
    "Stars",
    "Date Reviewed",
    "Comments",
  ];
  const expectedFields = [
    "id",
    "itemId",
    "reviewerEmail",
    "stars",
    "dateReviewed",
    "comments",
  ];
<<<<<<< HEAD
=======
  const expectedHeaders = ["id", "Item Id", "Reviewer Email", "Stars", "Date Reviewed","Comments"];
  const expectedFields = ["id", "itemId", "reviewerEmail", "stars", "dateReviewed","comments"];
>>>>>>> 9f9fd184 (adding menuitemreview table, story, and tests)
=======
>>>>>>> 7d038e06 (fixing formatting)
  const testId = "MenuItemReviewTable";

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable menuitemreviews={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuitemreviews={menuItemReviewFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "6",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemId`),
    ).toHaveTextContent("20");
    expect(
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7d038e06 (fixing formatting)
      screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
    ).toHaveTextContent("somwest@gmail.com");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("3");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
    ).toHaveTextContent("2025-05-01T22:48:12");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("it was alright");
<<<<<<< HEAD
=======
        screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
      ).toHaveTextContent("somwest@gmail.com");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-stars`),
      ).toHaveTextContent("3");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
      ).toHaveTextContent("2025-05-01T22:48:12");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-comments`),
      ).toHaveTextContent("it was alright");
>>>>>>> 9f9fd184 (adding menuitemreview table, story, and tests)
=======
>>>>>>> 7d038e06 (fixing formatting)

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "7",
    );
    expect(
<<<<<<< HEAD
<<<<<<< HEAD
      screen.getByTestId(`${testId}-cell-row-1-col-itemId`),
    ).toHaveTextContent("25");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`),
    ).toHaveTextContent("swaggypomme@gmail.com");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-stars`),
    ).toHaveTextContent("5");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`),
    ).toHaveTextContent("2025-05-24T11:40:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-comments`),
    ).toHaveTextContent("good price, great taste");

=======
        screen.getByTestId(`${testId}-cell-row-1-col-itemId`),
      ).toHaveTextContent("25");
=======
      screen.getByTestId(`${testId}-cell-row-1-col-itemId`),
    ).toHaveTextContent("25");
>>>>>>> 7d038e06 (fixing formatting)
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`),
    ).toHaveTextContent("swaggypomme@gmail.com");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-stars`),
    ).toHaveTextContent("5");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`),
    ).toHaveTextContent("2025-05-24T11:40:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-comments`),
    ).toHaveTextContent("good price, great taste");

<<<<<<< HEAD

>>>>>>> 9f9fd184 (adding menuitemreview table, story, and tests)
=======
>>>>>>> 7d038e06 (fixing formatting)
    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuitemreviews={menuItemReviewFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7d038e06 (fixing formatting)
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "6",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemId`),
    ).toHaveTextContent("20");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
    ).toHaveTextContent("somwest@gmail.com");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("3");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
    ).toHaveTextContent("2025-05-01T22:48:12");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("it was alright");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "7",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-itemId`),
    ).toHaveTextContent("25");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`),
    ).toHaveTextContent("swaggypomme@gmail.com");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-stars`),
    ).toHaveTextContent("5");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`),
    ).toHaveTextContent("2025-05-24T11:40:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-comments`),
    ).toHaveTextContent("good price, great taste");
<<<<<<< HEAD
=======
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
  
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
        "6",
      );
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-itemId`),
      ).toHaveTextContent("20");
      expect(
          screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
        ).toHaveTextContent("somwest@gmail.com");
        expect(
          screen.getByTestId(`${testId}-cell-row-0-col-stars`),
        ).toHaveTextContent("3");
        expect(
          screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
        ).toHaveTextContent("2025-05-01T22:48:12");
        expect(
          screen.getByTestId(`${testId}-cell-row-0-col-comments`),
        ).toHaveTextContent("it was alright");
  
      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
        "7",
      );
      expect(
          screen.getByTestId(`${testId}-cell-row-1-col-itemId`),
        ).toHaveTextContent("25");
      expect(
          screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`),
      ).toHaveTextContent("swaggypomme@gmail.com");
      expect(
          screen.getByTestId(`${testId}-cell-row-1-col-stars`),
      ).toHaveTextContent("5");
      expect(
          screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`),
      ).toHaveTextContent("2025-05-24T11:40:00");
      expect(
          screen.getByTestId(`${testId}-cell-row-1-col-comments`),
      ).toHaveTextContent("good price, great taste");
>>>>>>> 9f9fd184 (adding menuitemreview table, story, and tests)
=======
>>>>>>> 7d038e06 (fixing formatting)

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuitemreviews={menuItemReviewFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("6");
    expect(
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7d038e06 (fixing formatting)
      screen.getByTestId(`${testId}-cell-row-0-col-itemId`),
    ).toHaveTextContent("20");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
    ).toHaveTextContent("somwest@gmail.com");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("3");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
    ).toHaveTextContent("2025-05-01T22:48:12");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("it was alright");
<<<<<<< HEAD
=======
        screen.getByTestId(`${testId}-cell-row-0-col-itemId`),
      ).toHaveTextContent("20");
      expect(
          screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
        ).toHaveTextContent("somwest@gmail.com");
        expect(
          screen.getByTestId(`${testId}-cell-row-0-col-stars`),
        ).toHaveTextContent("3");
        expect(
          screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
        ).toHaveTextContent("2025-05-01T22:48:12");
        expect(
          screen.getByTestId(`${testId}-cell-row-0-col-comments`),
        ).toHaveTextContent("it was alright");
>>>>>>> 9f9fd184 (adding menuitemreview table, story, and tests)
=======
>>>>>>> 7d038e06 (fixing formatting)

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/menuitemreview/edit/6"),
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/menuitemreview")
      .reply(200, { message: "Menu Item Review deleted" });

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuitemreviews={menuItemReviewFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered
    expect(
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7d038e06 (fixing formatting)
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("6");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemId`),
    ).toHaveTextContent("20");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
    ).toHaveTextContent("somwest@gmail.com");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("3");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
    ).toHaveTextContent("2025-05-01T22:48:12");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("it was alright");
<<<<<<< HEAD
=======
        await screen.findByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("6");
      expect(
          screen.getByTestId(`${testId}-cell-row-0-col-itemId`),
        ).toHaveTextContent("20");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`),
          ).toHaveTextContent("somwest@gmail.com");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-stars`),
          ).toHaveTextContent("3");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`),
          ).toHaveTextContent("2025-05-01T22:48:12");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-comments`),
          ).toHaveTextContent("it was alright");
>>>>>>> 9f9fd184 (adding menuitemreview table, story, and tests)
=======
>>>>>>> 7d038e06 (fixing formatting)

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 6 });
  });
});
