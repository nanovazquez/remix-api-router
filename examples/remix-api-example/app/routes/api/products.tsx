import apiRouter from "../../../../../src/index";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  DataFunctionArgs,
} from "@remix-run/node";

/**
 * /api/products
 */

// Define all routes
const router = apiRouter();
router
  .get((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .post((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .put((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .patch((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .delete((args: DataFunctionArgs) => json({ method: "GET" }, 200));

export const loader: LoaderFunction = router.loader();
export const action: ActionFunction = router.actions();
