"use client";

import { useQuery } from "@tanstack/react-query";
import { useSessionQuery } from "@/features/auth/api/use-session-query";
import { useTRPCClient } from "@/trpc/client";
import type { ListTodosInput } from "../types/list-todos-input";
import { getTodoListsQueryKey } from "./todo-list-query-key";

export function useTodosQuery(input: ListTodosInput) {
	const trpcClient = useTRPCClient();
	const userId = useSessionQuery().data?.user?.id;

	return useQuery({
		queryKey: [...getTodoListsQueryKey(userId), input],
		queryFn: () => trpcClient.todos.list.query(input),
	});
}
