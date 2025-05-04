import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "pages/MenuItemReview/MenuItemReviewEditPage",
  id: 'pages-restaurants-restauranteditpage-1',
  component: MenuItemReviewEditPage,
};

const Template = () => <MenuItemReviewEditPage storybook={true} />;

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
    http.get("/api/MenuItemReview", () => {
      return HttpResponse.json(menuItemReviewFixtures.threeReview[0], {
        status: 200,
      });
    }),
    http.put("/api/MenuItemReview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
    http.put("/api/MenuItemReview", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
