import { todosPerPage } from "../config/todos-per-page";
import type { Todo } from "../types/todo";
import type { TodoListData } from "../types/todo-list-data";

export function removeTodoFromFilteredList(
	data: TodoListData,
	todoId: Todo["id"],
): TodoListData {
	const totalItems = Math.max(0, data.pagination.totalItems - 1);
	const totalPages = Math.max(1, Math.ceil(totalItems / todosPerPage));

	return {
		...data,
		todos: data.todos.filter((todo) => todo.id !== todoId),
		pagination: {
			page: Math.min(data.pagination.page, totalPages),
			totalItems,
			totalPages,
		},
	};
}
