import type { ListTodosInput } from "../types/list-todos-input";
import type { Todo } from "../types/todo";

export function doesTodoMatchFilters(todo: Todo, input: ListTodosInput) {
	if (input.category !== "all" && todo.category !== input.category)
		return false;
	if (input.priority !== "all" && todo.priority !== input.priority)
		return false;
	if (input.status === "active" && todo.done) return false;
	if (input.status === "completed" && !todo.done) return false;

	return todo.text.toLowerCase().includes(input.search.toLowerCase());
}
