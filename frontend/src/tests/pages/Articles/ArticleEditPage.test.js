import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticleEditPage from "main/pages/Articles/ArticleEditPage";

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

describe("ArticleEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "Ranking UCSB’s most vegetarian-friendly dining halls",
        url: "https://dailynexus.com/2023-08-24/ranking-ucsbs-most-vegetarian-friendly-dining-halls/",
        explanation: "Daily Nexus article 1",
        email: "karenyuan@ucsb.edu",
        dateAdded: "2023-08-20T09:00:01",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: 17,
        title: "Ranking UCSB’s most vegetarian-friendly dining halls edits",
        url: "https://dailynexus.com/2023-08-05/ranking-ucsbs-most-vegetarian-friendly-dining-halls/",
        explanation: "Daily Nexus article 11",
        email: "test@ucsb.edu",
        dateAdded: "2023-08-20T09:00:02",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByLabelText("Url");
      const explanationField = screen.getByLabelText("Explanation");
      const emailField = screen.getByLabelText("Email");
      const dateAddedField = screen.getByLabelText("Date Added (iso format)");

      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue(
        "Ranking UCSB’s most vegetarian-friendly dining halls",
      );

      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue(
        "https://dailynexus.com/2023-08-24/ranking-ucsbs-most-vegetarian-friendly-dining-halls/",
      );

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("Daily Nexus article 1");

      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("karenyuan@ucsb.edu");

      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2023-08-20T09:00:01.000");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: {
          value: "Ranking UCSB’s most vegetarian-friendly dining halls edits",
        },
      });
      fireEvent.change(urlField, {
        target: {
          value:
            "https://dailynexus.com/2023-08-05/ranking-ucsbs-most-vegetarian-friendly-dining-halls/",
        },
      });
      fireEvent.change(explanationField, {
        target: { value: "Daily Nexus article 11" },
      });
      fireEvent.change(emailField, {
        target: { value: "test@ucsb.edu" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2023-08-20T09:00:02" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 17 title: Ranking UCSB’s most vegetarian-friendly dining halls edits",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "Ranking UCSB’s most vegetarian-friendly dining halls edits",
          url: "https://dailynexus.com/2023-08-05/ranking-ucsbs-most-vegetarian-friendly-dining-halls/",
          explanation: "Daily Nexus article 11",
          email: "test@ucsb.edu",
          dateAdded: "2023-08-20T09:00:02.000",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
    });
  });
});