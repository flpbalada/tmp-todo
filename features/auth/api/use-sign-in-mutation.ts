"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTodoMutationState } from "@/features/todos/api/todo-mutation-cache";
import { todoListsQueryKey } from "@/features/todos/api/todo-list-query-key";
import { signIn } from "./auth-api";
import { sessionQueryKey } from "./use-session-query";

export function useSignInMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: signIn,
		onSuccess: (session) => {
			removeTodoMutationState(queryClient);
			queryClient.removeQueries({
				queryKey: todoListsQueryKey,
			});
			queryClient.setQueryData(sessionQueryKey, session);
		},
	});
}
