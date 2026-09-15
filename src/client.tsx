import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { StartClient } from "@tanstack/react-start/client";
import { getRouter } from "./router";

const spaRoot = document.getElementById("root");

startTransition(() => {
  if (spaRoot) {
    createRoot(spaRoot).render(
      <StrictMode>
        <RouterProvider router={getRouter()} />
      </StrictMode>,
    );
    return;
  }
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
