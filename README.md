# Remix API Router

[![Build status](https://github.com/nanovazquez/remix-api-router/actions/workflows/ci-cd.yaml/badge.svg?branch=main)](https://github.com/nanovazquez/remix-api-router/actions/workflows/ci-cd.yaml) [![Coverage Status](https://coveralls.io/repos/github/nanovazquez/remix-api-router/badge.svg)](https://coveralls.io/github/nanovazquez/remix-api-router) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![npm](https://img.shields.io/npm/v/remix-api-router.svg?style=flat)](https://www.npmjs.com/package/remix-api-router)
[![npm](https://img.shields.io/npm/dw/remix-api-router.svg)](https://www.npmjs.com/package/remix-api-router)

Library for creating [APIs in Remix](https://remix.run/docs/en/v1/guides/resource-routes#handling-different-request-methods) using a chaining approach, similar to Express middleware.

> **Note:** originally I was planning to implement a [chain-of-responsibility pattern](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) with the same contract as [Express](https://expressjs.com/en/guide/routing.html), but I wasn't sure how much adoption it will have. If you are interesting in it, [let's talk!](https://github.com/nanovazquez/remix-api-router/issues).

## Installation

```bash
npm i remix-api-router
```

or

```bash
yarn add remix-api-router
```

## Usage

For example, create a **products.tsx** file inside a Remix app, under the **app/routes/api** folder, and paste the following code:

```typescript
import { apiRouter } from "remix-api-router";
import { checkAuth } from "auth";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, DataFunctionArgs } from "@remix-run/node";

/**
 * /api/products
 */

// Define all routes for this endpoint and their handlers
const router = apiRouter();
router
  .get(checkAuth, async (args: DataFunctionArgs) => {
    await fetch("https://google.com");
    return json({ message: "GET" }, 200);
  })
  .post(checkAuth, (args: DataFunctionArgs) => json({ message: "POST" }, 200))
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
```

> **Note** see a fully working example [here](./examples/remix-api-example/).

## Features

- Same API as Remix for developing handlers: it's just sugar syntax to provide a chaining-like approach.
- Provides a handler for errors/exceptions of your code by default, returning `500` (you can provide your own).
- Provides a handler for no matching routes, returning `405` (you can provide your own).
- Lightweight (~ 4.5KB) => Suitable for serverless environment.
- TypeScript support.

## API

### General rules

1. Create a single router instance per file.
1. A handler that returns a value stops the chaining process. The expected return value is a `Response` object, just [what Remix expects](https://remix.run/docs/en/v1/api/conventions#returning-response-instances).
1. A handler that returns either nothing or a Promise with no return value (`void` or `Promise<void>` will tell the chain to continue processing the request with the other handlers.
1. A handler that throws an error will also tell the chain to stop processing the request. _You can configure the error handling with your own logic by configuring the `router.error` handler._
1. If a request arrives and no handler is configured, it will return a default response: `405 Method not allowed`. _You can configure this with your own logic by configuring the `router.noMatch` handler._
1. Always connect the router with Redux via the named exports `loader` and `action`.
1. Configure handlers once per router, as other configurations will override the previous ones.

### Configuration

You can initialize the router using either a class instantiation or a factory instantiation:

- Use the _default export_ for a class instantiation:

  ```typescript
  import ApiRouter from "remix-api-router";
  import { json } from "@remix-run/node";

  const router = new ApiRouter();
  router.get(() => json({ hello: "world" }, 200)).post(() => json({ hello: "world" }, 201));
  ```

- Use the _named export "apiRouter"_ for the factory instantiation:

  ```typescript
  import { apiRouter } from "remix-api-router";
  import { json } from "@remix-run/node";

  const router = new ApiRouter();
  router.get(() => json({ hello: "world" }, 200)).post(() => json({ hello: "world" }, 201));
  ```

Last, hook the router with the Remix `loader` and `action` by simply exporting the following at the end of the file:

```typescript
import { apiRouter } from "remix-api-router";
import { json } from "@remix-run/node";

const router = apiRouter();
router
  .get(() => json({ hello: "world" }, 200))
  .post(() => json({ hello: "world" }, 201))
  ...

export const loader: LoaderFunction = router.loader();
export const action: ActionFunction = router.actions();
```

### Route handling

It supports all HTTP Methods by adding a handler with the same contract provided by Remix. For example:

To handle `GET /api/categories/$id` requests, use the following code:

```typescript
import { apiRouter } from "remix-api-router";
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
```

To handle `GET /api/categories` and `POST /api/categories` requests, use:

```typescript
import { apiRouter } from "remix-api-router";
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
```
