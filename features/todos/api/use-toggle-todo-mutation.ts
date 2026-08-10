"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSessionQuery } from "@/features/auth/api/use-session-query";
import { useTRPC } from "@/trpc/client";
import type { ItemError } from "../types/item-error";
import { restoreTodoLists } from "./restore-todo-lists";
import {
	getTodoMutationMeta,
	invalidateTodoListsWhenIdle,
	isCurrentTodoUser,
} from "./todo-mutation-cache";
import { toggleTodoInList } from "./toggle-todo-in-list";
import { updateActiveTodoLists } from "./update-active-todo-lists";
import { getTodoListsQueryKey } from "./todo-list-query-key";

export function useToggleTodoMutation() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const userId = useSessionQuery().data?.user?.id;
	const [toggleError, setToggleError] = useState<ItemError | null>(null);
	const mutation = useMutation(
		trpc.todos.toggle.mutationOptions({
			meta: getTodoMutationMeta(userId),
			onMutate: async (input) => {
				const snapshots = await updateActiveTodoLists(
					queryClient,
					getTodoListsQueryKey(userId),
					(data, listInput) =>
						toggleTodoInList(data, input.id, input.done, listInput),
				);
				return { snapshots, userId };
			},
			onSuccess: (result, input, context) => {
				if (!isCurrentTodoUser(queryClient, context?.userId)) return;
				if (!result.success) {
					restoreTodoLists(queryClient, context?.snapshots, input.id);
				}
			},
			onError: (_error, input, context) => {
				if (!isCurrentTodoUser(queryClient, context?.userId)) return;
				restoreTodoLists(queryClient, context?.snapshots, input.id);
			},
			onSettled: async (_result, _error, _input, context) => {
				await invalidateTodoListsWhenIdle(queryClient, context?.userId);
			},
		}),
	);
	const clearToggleError = (id: ItemError["id"]) =>
		setToggleError((error) => (error?.id === id ? null : error));

	return {
		mutation,
		toggleError,
		setToggleError,
		clearToggleError,
	};
}
