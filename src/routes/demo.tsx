import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * `/demo` was a "book a demo" sales page — SaaS language that never fit a Bible
 * site. It is reframed as `/groups` ("Using SEEK in your group"), which is what
 * the page was actually for. Permanent redirect so the old URL keeps working and
 * passes its link equity, and so the sales framing stops being reachable.
 */
export const Route = createFileRoute("/demo")({
  beforeLoad: () => {
    throw redirect({ to: "/groups", statusCode: 301 });
  },
});
