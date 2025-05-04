import { toast } from "react-toastify";

export const cellToAxiosParamsDelete = (cell) => ({
  url: "/api/recommendation-requests/delete",
  method: "DELETE",
  params: {
    id: cell.row.values.id,
  },
});

export const onDeleteSuccess = (response) => {
  console.log(response);
  toast(response.message);
};
