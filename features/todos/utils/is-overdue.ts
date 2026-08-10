import type { Todo } from "../types/todo";

export function isOverdue(todo: Todo) {
	if (!todo.dueDate || todo.done) return false;
	return new Date(todo.dueDate) < new Date();
}
