import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticleEditPage from "main/pages/Articles/ArticleEditPage";
import { articlesFixtures } from "fixtures/articlesFixtures";

export default {
  title: "pages/Articles/ArticleEditPage",
  component: ArticleEditPage,
};

const Template = () => <ArticleEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles", () => {
      return HttpResponse.json(articlesFixtures.threeArticles[0], {
        status: 200,
      });
    }),

    http.put("/api/articles", () => {
      return HttpResponse.json(
        {
          id: 17,
          title: "Ranking UCSB’s most vegetarian-friendly dining halls edits",
          url: "https://dailynexus.com/2023-08-05/ranking-ucsbs-most-vegetarian-friendly-dining-halls/",
          explanation: "Daily Nexus article 11",
          email: "test@ucsb.edu",
          dateAdded: "2023-08-20T09:00:02",
        },
        { status: 200 },
      );
    }),
  ],
};
