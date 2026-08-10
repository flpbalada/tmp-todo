"use client";

import { useQuery } from "@tanstack/react-query";
import { getSession } from "./auth-api";

export const sessionQueryKey = ["auth", "session"] as const;

export function useSessionQuery() {
	return useQuery({
		queryKey: sessionQueryKey,
		queryFn: getSession,
		retry: false,
		refetchOnWindowFocus: "always",
	});
}
