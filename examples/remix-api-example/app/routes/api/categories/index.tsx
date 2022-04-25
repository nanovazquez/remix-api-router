import { apiRouter } from "../../../../../../src/";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, DataFunctionArgs } from "@remix-run/node";

/**
 * /api/categories
 */

const router = apiRouter();

router
  .get(async ({ request, context, params }: DataFunctionArgs) => {
    // See https://remix.run/docs/en/v1/guides/data-loading#url-search-params
    const url = new URL(request.url);
    const term = url.searchParams.get("term");
    return json(await fakeProductSearch(term));
  })
  .post(async ({ request, context, params }: DataFunctionArgs) => {
    const body = await request.json();
    return json({ message: `Sent body ${JSON.stringify(body)}` });
  });

async function fakeProductSearch(term: string | null) {
  return [
    { id: 1, name: "Category A" },
    { id: 2, name: "Category B" },
  ];
}

export const loader: LoaderFunction = router.loader();
export const action: ActionFunction = router.actions();
