"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { ColorProvider } from "./color-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ColorProvider>
          {children}
        </ColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
