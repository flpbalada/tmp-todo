import type { Todo as PayloadTodo } from "@/payload-types";
import type { Todo } from "../types/todo";

export function mapPayloadTodo(todo: PayloadTodo): Todo {
	return {
		id: todo.id,
		text: todo.text,
		done: todo.done,
		priority: todo.priority,
		category: todo.category,
		createdAt: todo.createdAt,
		...(todo.dueDate ? { dueDate: todo.dueDate } : {}),
		...(todo.completedAt ? { completedAt: todo.completedAt } : {}),
	};
}
