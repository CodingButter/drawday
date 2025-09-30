import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
export function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-500 p-4">
      {/* All routes render here */}
      <Outlet />

      {/* One global toaster host for the whole app */}
      <Toaster richColors closeButton />
    </div>
  );
}
