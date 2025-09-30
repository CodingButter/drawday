import { HashRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HashRouter>
  );
}
