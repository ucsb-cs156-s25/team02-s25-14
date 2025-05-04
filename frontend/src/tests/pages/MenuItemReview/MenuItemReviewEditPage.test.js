import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewEditPage tests", () => {
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
      axiosMock.onGet("/api/MenuItemReview", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(screen.queryByTestId("MenuItemReviewForm-itemId")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/MenuItemReview", { params: { id: 17 } }).reply(200, {
        id: 17,
        itemId: 20,
        reviewerEmail: "somwest@gmail.com",
        stars: 3,
        dateReviewed: "2025-05-01T22:48:12",
        comments: "it was alright",
      });
      axiosMock.onPut("/api/MenuItemReview").reply(200, {
        id: 17,
        itemId: 20,
        reviewerEmail: "samwest@gmail.com",
        stars: 3,
        dateReviewed: "2025-05-01T22:48:12",
        comments: "it was aight",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByLabelText("Item Id");
      const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByLabelText("Date Reviewed (in UTC)");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue(20);

      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("somwest@gmail.com");

      expect(starField).toBeInTheDocument();
      expect(starField).toHaveValue(3);

      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2025-05-01T22:48:12.000");

      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("it was alright");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, {
        target: { value: "20" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "samwest@gmail.com" },
      });
      fireEvent.change(starField, {
        target: { value: "3" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2025-05-01T22:48:12.000" },
      });
      fireEvent.change(commentsField, {
        target: { value: "it was aight" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "MenuItemReview Updated - id: 17 item id: 20 reviewer email: samwest@gmail.com stars: 3 date reviewed: 2025-05-01T22:48:12 comments: it was aight",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: 20,
          reviewerEmail: "samwest@gmail.com",
          stars: 3,
          dateReviewed: "2025-05-01T22:48:12.000",
          comments: "it was aight",
        }),
      ); // posted object

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreview" });
    });

  });
});

