import React from "react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";

export default {
  title: "components/UCSBOrganization/UCSBOrganizationForm",
  component: UCSBOrganizationForm,
};

const Template = (args) => {
  return <UCSBOrganizationForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: {
    orgCode: "RHA",
    orgTranslationShort: "Res Hall Assoc",
    orgTranslation: "Residence Halls Association",
    inactive: false,
  },
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
