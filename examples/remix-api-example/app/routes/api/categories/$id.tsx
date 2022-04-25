import { apiRouter } from "../../../../../../src/ApiRouter";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, DataFunctionArgs } from "@remix-run/node";

/**
 * /api/categories/$id
 */

const router = apiRouter();

router.get(({ request, context, params }: DataFunctionArgs) => {
  return json({ message: `Requested category with ID ${params.id}` }, 200);
});

export const loader: LoaderFunction = router.loader();
export const action: ActionFunction = router.actions();
