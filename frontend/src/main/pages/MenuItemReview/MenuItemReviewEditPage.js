import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: menuitemreview,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/MenuItemReview?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/MenuItemReview`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (menuitemreview) => ({
    url: "/api/MenuItemReview",
    method: "PUT",
    params: {
      id: menuitemreview.id,
    },
    data: {
      itemId: menuitemreview.itemId,
      reviewerEmail: menuitemreview.reviewerEmail,
      stars: menuitemreview.stars,
      dateReviewed: menuitemreview.dateReviewed,
      comments: menuitemreview.comments,
    },
  });

  const onSuccess = (menuitemreview) => {
    toast(
      `MenuItemReview Updated - id: ${menuitemreview.id} item id: ${menuitemreview.itemId} reviewer email: ${menuitemreview.reviewerEmail} stars: ${menuitemreview.stars} date reviewed: ${menuitemreview.dateReviewed} comments: ${menuitemreview.comments}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/MenuItemReview?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Menu Item Review</h1>
        {menuitemreview && (
          <MenuItemReviewForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={menuitemreview}
          />
        )}
      </div>
    </BasicLayout>
  );
}
