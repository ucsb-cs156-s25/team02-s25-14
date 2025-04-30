import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/RecommendationRequestUtils";

describe("RecommendationRequestUtils", () => {
  test("cellToAxiosParamsDelete returns correct url and params", () => {
    const cell = { row: { values: { id: 42 } } };

    const result = cellToAxiosParamsDelete(cell);

    expect(result.url).toEqual("/api/recommendationrequest");
    expect(result.method).toEqual("DELETE");
    expect(result.params).toEqual({ id: 42 });
  });

  test("onDeleteSuccess logs the message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    onDeleteSuccess("Test delete message");
    expect(consoleSpy).toHaveBeenCalledWith("Test delete message");
    consoleSpy.mockRestore();
  });
});
