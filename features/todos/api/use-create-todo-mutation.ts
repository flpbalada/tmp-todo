"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSessionQuery } from "@/features/auth/api/use-session-query";
import { useTRPC } from "@/trpc/client";
import {
	getTodoMutationMeta,
	invalidateTodoListsWhenIdle,
} from "./todo-mutation-cache";

export function useCreateTodoMutation() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const userId = useSessionQuery().data?.user?.id;

	return useMutation(
		trpc.todos.create.mutationOptions({
			meta: getTodoMutationMeta(userId),
			onMutate: () => ({ userId }),
			onSettled: async (_result, _error, _input, context) => {
				await invalidateTodoListsWhenIdle(queryClient, context?.userId);
			},
		}),
	);
}
