import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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

describe("HelpRequestEditPage tests", () => {
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequestForm-id"),
      ).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "student@ucsb.edu",
        teamId: "team-5",
        tableOrBreakoutRoom: "Table 7",
        requestTime: "2024-01-01T12:00",
        explanation: "Need help with configuration",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: "17",
        requesterEmail: "updated@ucsb.edu",
        teamId: "team-5-updated",
        tableOrBreakoutRoom: "Table 8",
        requestTime: "2024-01-02T12:00",
        explanation: "Updated configuration issue",
        solved: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const timeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(emailField).toHaveValue("student@ucsb.edu");
      expect(teamIdField).toHaveValue("team-5");
      expect(tableField).toHaveValue("Table 7");
      expect(timeField).toHaveValue("2024-01-01T12:00");
      expect(explanationField).toHaveValue("Need help with configuration");
      expect(solvedField).not.toBeChecked();

      fireEvent.change(emailField, { target: { value: "updated@ucsb.edu" } });
      fireEvent.change(teamIdField, { target: { value: "team-5-updated" } });
      fireEvent.change(tableField, { target: { value: "Table 8" } });
      fireEvent.change(timeField, { target: { value: "2024-01-02T12:00" } });
      fireEvent.change(explanationField, {
        target: { value: "Updated configuration issue" },
      });
      fireEvent.click(solvedField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "HelpRequest Updated - id: 17 email: updated@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "updated@ucsb.edu",
          teamId: "team-5-updated",
          tableOrBreakoutRoom: "Table 8",
          requestTime: "2024-01-02T12:00",
          explanation: "Updated configuration issue",
          solved: true,
        }),
      );
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const timeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(emailField).toHaveValue("student@ucsb.edu");
      expect(teamIdField).toHaveValue("team-5");
      expect(tableField).toHaveValue("Table 7");
      expect(timeField).toHaveValue("2024-01-01T12:00");
      expect(explanationField).toHaveValue("Need help with configuration");
      expect(solvedField).not.toBeChecked();

      fireEvent.change(emailField, { target: { value: "updated@ucsb.edu" } });
      fireEvent.change(teamIdField, { target: { value: "team-5-updated" } });
      fireEvent.change(tableField, { target: { value: "Table 8" } });
      fireEvent.change(timeField, { target: { value: "2024-01-02T12:00" } });
      fireEvent.change(explanationField, {
        target: { value: "Updated configuration issue" },
      });
      fireEvent.click(solvedField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "HelpRequest Updated - id: 17 email: updated@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
    });
    test("Changes when you click button Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(submitButton).toHaveTextContent("Update");
    });
  });
});
