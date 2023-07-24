const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
};

type CallbackHandler = (
  request: Request,
  params: Record<string, string>,
  next: () => Promise<Response> | Response
) => Promise<Response> | Response;

type Route = {
  pattern: URLPattern;
  handler: CallbackHandler;
  middleware: CallbackHandler[];
};

export class Router {
  // Using a map to hold routes keyed by method
  private routes: Map<string, Set<Route>> = new Map();

  constructor() {
    Object.values(METHODS).forEach((method) => {
      this.routes.set(method, new Set());
    });
  }

  private add(
    method: string,
    pathname: string,
    handler: CallbackHandler,
    ...middleware: CallbackHandler[]
  ) {
    if (
      Array.from(this.routes.get(method) || []).find(
        (route) => route.pattern.pathname === pathname
      )
    ) {
      throw new Error(`Route ${method} ${pathname} already exists`);
    }

    const route: Route = {
      pattern: new URLPattern({ pathname }),
      handler,
      middleware,
    };

    this.routes.get(method)?.add(route);
  }

  get(
    pathname: string,
    handler: CallbackHandler,
    ...middleware: CallbackHandler[]
  ) {
    this.add(METHODS.GET, pathname, handler, ...middleware);
  }

  post(
    pathname: string,
    handler: CallbackHandler,
    ...middleware: CallbackHandler[]
  ) {
    this.add(METHODS.POST, pathname, handler, ...middleware);
  }

  async route(req: Request): Promise<Response> {
    const routesForMethod = Array.from(this.routes.get(req.method) || []);

    for (const route of routesForMethod) {
      if (route.pattern.test(req.url)) {
        const params = route.pattern.exec(req.url)?.pathname?.groups as Record<
          string,
          string
        >;

        let idx = 0;
        const next = () => {
          if (idx < route.middleware.length) {
            return route.middleware[idx++](req, params, next);
          } else {
            return route.handler(req, params, next);
          }
        };

        const response = await next();
        if (response) {
          return response;
        }
      }
    }

    return new Response("Not found", { status: 404 });
  }
}

export default Router;
