"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-sans text-sm",
        }}
      />
    </NextThemesProvider>
  );
}
