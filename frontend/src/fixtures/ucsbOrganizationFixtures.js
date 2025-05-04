const ucsbOrganizationFixtures = {
  oneUCSBOrganization: {
    orgCode: "RHA",
    orgTranslationShort: "Res Hall Assoc",
    orgTranslation: "Residence Halls Association",
    inactive: false,
  },
  threeUCSBOrganizations: [
    {
      orgCode: "AS",
      orgTranslationShort: "Assoc Students",
      orgTranslation: "Associated Students",
      inactive: false,
    },
    {
      orgCode: "ASBS",
      orgTranslationShort: "AS Bike Shop",
      orgTranslation: "Associated Students Bike Shop",
      inactive: true,
    },
    {
      orgCode: "ARC",
      orgTranslationShort: "Asian Resource Center",
      orgTranslation: "Asian Resource Center",
      inactive: false,
    },
  ],
};

export { ucsbOrganizationFixtures };
