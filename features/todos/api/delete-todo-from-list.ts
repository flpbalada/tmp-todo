import { todosPerPage } from "../config/todos-per-page";
import type { Todo } from "../types/todo";
import type { TodoListData } from "../types/todo-list-data";
import { isOverdue } from "../utils/is-overdue";

export function deleteTodoFromList(
	data: TodoListData,
	todoId: Todo["id"],
): TodoListData {
	const todo = data.todos.find((item) => item.id === todoId);
	if (!todo) return data;

	const totalItems = Math.max(0, data.pagination.totalItems - 1);
	const totalPages = Math.max(1, Math.ceil(totalItems / todosPerPage));

	return {
		...data,
		todos: data.todos.filter((item) => item.id !== todoId),
		stats: {
			...data.stats,
			total: Math.max(0, data.stats.total - 1),
			completed: Math.max(0, data.stats.completed - Number(todo.done)),
			active: Math.max(0, data.stats.active - Number(!todo.done)),
			overdue: Math.max(0, data.stats.overdue - Number(isOverdue(todo))),
		},
		pagination: {
			...data.pagination,
			page: Math.min(data.pagination.page, totalPages),
			totalItems,
			totalPages,
		},
	};
}
