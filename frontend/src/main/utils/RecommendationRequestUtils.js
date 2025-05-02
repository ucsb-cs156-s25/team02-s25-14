export const cellToAxiosParamsDelete = (cell) => ({
  url: "/api/recommendation-requests/delete",
  method: "DELETE",
  params: {
    id: cell.row.values.id,
  },
});

export const onDeleteSuccess = (message) => {
  console.log(message);
};
