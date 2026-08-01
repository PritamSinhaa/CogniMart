import { Link, useRouteError } from "react-router-dom";

function RouteError() {
  const error = useRouteError();

  console.error("Route error:", error);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 text-foreground">
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">CogniMart</p>

        <h1 className="mt-3 text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-muted-foreground">
          We could not load this page. Please try again or return home.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Go to homepage
        </Link>
      </section>
    </main>
  );
}

export default RouteError;