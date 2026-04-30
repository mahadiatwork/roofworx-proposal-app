"use client";

import { Toaster } from "sonner";

/** App-wide snackbars (Sonner). */
export function SonnerToaster() {
  return (
    <Toaster
      position="bottom-center"
      closeButton
      richColors
      gap={10}
    />
  );
}
