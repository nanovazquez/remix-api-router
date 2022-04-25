import { apiRouter } from "../../../../../src/ApiRouter";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, DataFunctionArgs } from "@remix-run/node";

/**
 * /api/products
 */

async function checkAuth(): Promise<void> {
  // everything is ok, return an empty promise
  // simulating an async check
  await Promise.resolve();
}

function checkAuthFail(): Promise<void> | Promise<Response> | Response {
  return json({ error: "Unauthorized" }, { status: 401 });
}

// Define all routes
const router = apiRouter();
router
  .get(checkAuth, async (args: DataFunctionArgs) => {
    await fetch("https://google.com");
    return json({ message: "GET" }, 200);
  })
  .post(checkAuthFail, (args: DataFunctionArgs) => json({ message: "POST" }, 200))
  .put((args: DataFunctionArgs) => json({ message: "PUT" }, 200))
  .patch((args: DataFunctionArgs) => json({ message: "PATCH" }, 200))
  .delete((args: DataFunctionArgs) => {
    throw new Error("unexpected error");
  })
  .error((err) => {
    return json({ error: "Custom message: Server unavailable!" }, 500);
  });

export const loader: LoaderFunction = router.loader();
export const action: ActionFunction = router.actions();
