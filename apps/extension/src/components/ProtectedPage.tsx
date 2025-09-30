import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

export interface ProtectedPageProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function ProtectedPage() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return error || !session?.user ? (
    <Navigate to="/login" replace />
  ) : (
    <Outlet />
  );
}
