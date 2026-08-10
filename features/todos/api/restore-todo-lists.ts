import type { QueryClient } from "@tanstack/react-query";
import { todosPerPage } from "../config/todos-per-page";
import type { Todo } from "../types/todo";
import type { TodoListData } from "../types/todo-list-data";
import type { TodoListSnapshots } from "../types/todo-list-snapshots";

function restoreTodo(current: Todo[], before: Todo[], todoId: Todo["id"]) {
	const originalIndex = before.findIndex((todo) => todo.id === todoId);
	const restored = current.filter((todo) => todo.id !== todoId);
	if (originalIndex === -1) return restored;

	const original = before[originalIndex];
	const restoredIds = new Set(restored.map((todo) => todo.id));
	const nextTodo = before
		.slice(originalIndex + 1)
		.find((todo) => restoredIds.has(todo.id));
	if (nextTodo) {
		restored.splice(
			restored.findIndex((todo) => todo.id === nextTodo.id),
			0,
			original,
		);
		return restored;
	}

	const previousTodo = before
		.slice(0, originalIndex)
		.toReversed()
		.find((todo) => restoredIds.has(todo.id));
	const previousIndex = previousTodo
		? restored.findIndex((todo) => todo.id === previousTodo.id)
		: -1;
	restored.splice(previousIndex + 1, 0, original);
	return restored;
}

function subtractChange(current: number, before: number, after: number) {
	return Math.max(0, current - (after - before));
}

function restoreList(
	current: TodoListData,
	before: TodoListData,
	after: TodoListData,
	todoId: Todo["id"],
): TodoListData {
	const totalItems = subtractChange(
		current.pagination.totalItems,
		before.pagination.totalItems,
		after.pagination.totalItems,
	);
	const totalPages = Math.max(1, Math.ceil(totalItems / todosPerPage));

	return {
		...current,
		todos: restoreTodo(current.todos, before.todos, todoId),
		stats: {
			total: subtractChange(
				current.stats.total,
				before.stats.total,
				after.stats.total,
			),
			completed: subtractChange(
				current.stats.completed,
				before.stats.completed,
				after.stats.completed,
			),
			active: subtractChange(
				current.stats.active,
				before.stats.active,
				after.stats.active,
			),
			overdue: subtractChange(
				current.stats.overdue,
				before.stats.overdue,
				after.stats.overdue,
			),
		},
		pagination: {
			page: Math.min(before.pagination.page, totalPages),
			totalItems,
			totalPages,
		},
	};
}

export function restoreTodoLists(
	queryClient: QueryClient,
	snapshots: TodoListSnapshots | undefined,
	todoId: Todo["id"],
) {
	for (const { queryKey, before, after } of snapshots ?? []) {
		queryClient.setQueryData<TodoListData>(queryKey, (current) =>
			current ? restoreList(current, before, after, todoId) : current,
		);
	}
}
