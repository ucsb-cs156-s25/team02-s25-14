import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

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

describe("HelpRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /helprequests", async () => {
    const queryClient = new QueryClient();
    const helpRequest = {
      id: 3,
      requesterEmail: "student@ucsb.edu",
      teamId: "team-5",
      tableOrBreakoutRoom: "Table 7",
      requestTime: "2024-01-01T12:00",
      explanation: "Need help with configuration",
      solved: false,
    };

    axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    const teamIdInput = screen.getByLabelText("Team ID");
    const tableInput = screen.getByLabelText("Table or Breakout Room");
    const requestTimeInput = screen.getByLabelText("Request Time (ISO)");
    const explanationInput = screen.getByLabelText("Explanation");
    const solvedCheckbox = screen.getByLabelText("Solved");

    fireEvent.change(requesterEmailInput, {
      target: { value: "student@ucsb.edu" },
    });
    fireEvent.change(teamIdInput, { target: { value: "team-5" } });
    fireEvent.change(tableInput, { target: { value: "Table 7" } });
    fireEvent.change(requestTimeInput, {
      target: { value: "2024-01-01T12:00" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "Need help with configuration" },
    });
    fireEvent.click(solvedCheckbox);

    const createButton = screen.getByText("Create");
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "student@ucsb.edu",
      teamId: "team-5",
      tableOrBreakoutRoom: "Table 7",
      requestTime: "2024-01-01T12:00",
      explanation: "Need help with configuration",
      solved: true, // Checkbox returns string "true" when checked
    });

    expect(mockToast).toBeCalledWith(
      "New Help Request Created - id: 3 email: student@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
  });
});
