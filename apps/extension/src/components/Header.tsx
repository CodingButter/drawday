import { useQuery } from "@tanstack/react-query";
import { makeQueryFn } from "@/lib/queryFn";
import { type Session } from "@/lib/auth-client";

export function Header() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["/user"],
    queryFn: makeQueryFn<Session["user"]>(),
  });
}
