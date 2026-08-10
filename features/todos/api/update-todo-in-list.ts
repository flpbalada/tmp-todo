import type { ListTodosInput } from "../types/list-todos-input";
import type { TodoListData } from "../types/todo-list-data";
import type { UpdateTodoInput } from "../types/update-todo-input";
import { doesTodoMatchFilters } from "./does-todo-match-filters";
import { removeTodoFromFilteredList } from "./remove-todo-from-filtered-list";

export function updateTodoInList(
	data: TodoListData,
	input: UpdateTodoInput,
	listInput: ListTodosInput,
): TodoListData {
	const existing = data.todos.find((todo) => todo.id === input.id);
	if (!existing) return data;

	const updated = { ...existing, ...input };
	if (!doesTodoMatchFilters(updated, listInput)) {
		return removeTodoFromFilteredList(data, input.id);
	}

	return {
		...data,
		todos: data.todos.map((todo) => (todo.id === input.id ? updated : todo)),
	};
}
