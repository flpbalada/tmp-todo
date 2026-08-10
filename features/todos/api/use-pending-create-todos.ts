import { useMutationState } from "@tanstack/react-query";
import { useSessionQuery } from "@/features/auth/api/use-session-query";
import { useTRPC } from "@/trpc/client";
import { createTodoInputSchema } from "../schemas/create-todo-input-schema";
import type { Todo } from "../types/todo";
import type { ListTodosInput } from "../types/list-todos-input";
import { doesTodoMatchFilters } from "./does-todo-match-filters";
import { getTodoMutationUserId } from "./todo-mutation-cache";

interface PendingCreateTodo {
	key: string;
	todo: Todo;
}

export function usePendingCreateTodos(input: ListTodosInput) {
	const trpc = useTRPC();
	const userId = useSessionQuery().data?.user?.id;

	return useMutationState({
		filters: {
			mutationKey: trpc.todos.create.mutationKey(),
			status: "pending",
		},
		select: (mutation): PendingCreateTodo | null => {
			if (getTodoMutationUserId(mutation.options.meta) !== userId) return null;

			const createInput = createTodoInputSchema.safeParse(
				mutation.state.variables,
			);
			if (!createInput.success) {
				console.error(createInput.error);
				// TODO: Display a toast notification when shared notifications are available.
				return null;
			}

			const submittedAt = mutation.state.submittedAt;
			const todo = {
				id: `pending-${mutation.mutationId}`,
				text: createInput.data.text,
				done: false,
				priority: createInput.data.priority ?? "medium",
				category: createInput.data.category ?? "other",
				dueDate: createInput.data.dueDate,
				createdAt: new Date(submittedAt).toISOString(),
			};
			if (!doesTodoMatchFilters(todo, input)) return null;

			return {
				key: `create-${submittedAt}-${mutation.mutationId}`,
				todo,
			};
		},
	}).filter((todo): todo is PendingCreateTodo => todo !== null);
}
