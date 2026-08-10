import type { TodoListData } from "../types/todo-list-data";
import type { Todo } from "../types/todo";
import type { ListTodosInput } from "../types/list-todos-input";
import { isOverdue } from "../utils/is-overdue";
import { doesTodoMatchFilters } from "./does-todo-match-filters";
import { removeTodoFromFilteredList } from "./remove-todo-from-filtered-list";

export function toggleTodoInList(
	data: TodoListData,
	todoId: Todo["id"],
	done: Todo["done"],
	listInput: ListTodosInput,
): TodoListData {
	const todo = data.todos.find((item) => item.id === todoId);
	if (!todo || todo.done === done) return data;

	const completedChange = done ? 1 : -1;
	const willBeOverdue = Boolean(
		!done && todo.dueDate && new Date(todo.dueDate) < new Date(),
	);
	const overdueChange = Number(willBeOverdue) - Number(isOverdue(todo));

	const updatedTodo = {
		...todo,
		done,
		completedAt: done ? new Date().toISOString() : undefined,
	};
	const updatedData = {
		...data,
		todos: data.todos.map((item) => (item.id === todoId ? updatedTodo : item)),
		stats: {
			...data.stats,
			completed: data.stats.completed + completedChange,
			active: data.stats.active - completedChange,
			overdue: data.stats.overdue + overdueChange,
		},
	};

	return doesTodoMatchFilters(updatedTodo, listInput)
		? updatedData
		: removeTodoFromFilteredList(updatedData, todoId);
}
