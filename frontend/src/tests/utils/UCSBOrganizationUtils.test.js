import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/UCSBOrganizationUtils";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("UCSBOrganizationUtils", () => {
  describe("onDeleteSuccess", () => {
    it("should call toast with the message", () => {
      const message = "Test message";
      onDeleteSuccess(message);
      expect(toast).toHaveBeenCalledWith(message);
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    it("should return the correct axios parameters", () => {
      const cell = {
        row: {
          values: {
            orgCode: "TEST",
          },
        },
      };

      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: "/api/ucsborganizations",
        method: "DELETE",
        params: {
          orgCode: "TEST",
        },
      });
    });
  });
});
