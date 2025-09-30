import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SidePanel() {
  const { data: session, isPending, refetch } = authClient.useSession();

  return (
    <div className="w-screen h-screen bg-background">
      <h1 className="text-foreground">Welcome to the Side Panel</h1>
    </div>
  );
}
