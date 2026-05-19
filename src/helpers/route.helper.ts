const customRouter = (innerRouter: any, extraRoutes: any[] = []) => {
  let routes: any[];

  return {
    get prefix() {
      return innerRouter.prefix;
    },

    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);

      return routes;
    },
  };
};

export { customRouter };