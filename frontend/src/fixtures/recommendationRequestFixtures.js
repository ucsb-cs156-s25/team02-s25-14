const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requestorEmail: "tina@ucsb.edu",
    professorEmail: "professor@ucsb.edu",
    explanation: "bs/ms program letter of rec",
    dateRequested: "2025-04-28T18:07:00",
    dateNeeded: "2025-05-10T18:07:00",
    done: true,
  },
  threeRequests: [
    {
      id: 2,
      requestorEmail: "chloe@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "grad school application",
      dateRequested: "2024-04-28T11:56:04",
      dateNeeded: "2024-05-28T11:56:04",
      done: false,
    },
    {
      id: 3,
      requestorEmail: "mary@ucsb.edu",
      professorEmail: "prof1@ucsb.edu",
      explanation: "phd school application",
      dateRequested: "2024-04-15T11:56:04",
      dateNeeded: "2024-05-13T11:56:04",
      done: false,
    },
    {
      id: 4,
      requestorEmail: "nina@ucsb.edu",
      professorEmail: "prof2@ucsb.edu",
      explanation: "job letter of recommendation",
      dateRequested: "2024-04-20T11:56:04",
      dateNeeded: "2024-04-27T11:56:04",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };
