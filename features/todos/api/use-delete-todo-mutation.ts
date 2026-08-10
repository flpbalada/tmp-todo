"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSessionQuery } from "@/features/auth/api/use-session-query";
import { useTRPC } from "@/trpc/client";
import type { ItemError } from "../types/item-error";
import { deleteTodoFromList } from "./delete-todo-from-list";
import { restoreTodoLists } from "./restore-todo-lists";
import {
	getTodoMutationMeta,
	invalidateTodoListsWhenIdle,
	isCurrentTodoUser,
} from "./todo-mutation-cache";
import { updateActiveTodoLists } from "./update-active-todo-lists";
import { getTodoListsQueryKey } from "./todo-list-query-key";

export function useDeleteTodoMutation() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const userId = useSessionQuery().data?.user?.id;
	const [deleteError, setDeleteError] = useState<ItemError | null>(null);
	const mutation = useMutation(
		trpc.todos.delete.mutationOptions({
			meta: getTodoMutationMeta(userId),
			onMutate: async (input) => {
				const snapshots = await updateActiveTodoLists(
					queryClient,
					getTodoListsQueryKey(userId),
					(data) => deleteTodoFromList(data, input.id),
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
	const clearDeleteError = (id: ItemError["id"]) =>
		setDeleteError((error) => (error?.id === id ? null : error));

	return {
		mutation,
		deleteError,
		setDeleteError,
		clearDeleteError,
	};
}
