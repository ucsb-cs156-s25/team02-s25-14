import React from "react";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReview/MenuItemReviewTable",
  component: MenuItemReviewTable,
};

const Template = (args) => {
  return <MenuItemReviewTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  menuitemreviews: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  menuitemreviews: menuItemReviewFixtures.threeReview,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  menuitemreviews: menuItemReviewFixtures.threeReview,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuitemreview", () => {
      return HttpResponse.json(
        { message: "Menu Item Review deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
