const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "student1@ucsb.edu",
    teamId: "team1",
    tableOrBreakoutRoom: "Table 3",
    requestTime: "2023-10-01T14:30:00",
    explanation: "Need help with Spring Boot setup.",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      teamId: "team1",
      tableOrBreakoutRoom: "Table 3",
      requestTime: "2023-10-01T14:30:00",
      explanation: "Need help with Spring Boot setup.",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "student2@ucsb.edu",
      teamId: "team2",
      tableOrBreakoutRoom: "Breakout Room 2",
      requestTime: "2023-10-01T14:45:00",
      explanation: "Getting a 500 error on POST request.",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "student3@ucsb.edu",
      teamId: "team3",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2023-10-01T15:00:00",
      explanation: "Confused about how to write JPA queries.",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
