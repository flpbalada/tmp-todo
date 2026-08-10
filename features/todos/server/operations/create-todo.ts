import "server-only";

import type { Payload } from "payload";
import type { User } from "@/payload-types";
import type { CreateTodoInput } from "../../types/create-todo-input";
import type { Todo } from "../../types/todo";
import { mapPayloadTodo } from "../map-payload-todo";

export async function createTodo(
	payload: Payload,
	user: User,
	input: CreateTodoInput,
): Promise<Todo> {
	const todo = await payload.create({
		collection: "todos",
		data: {
			text: input.text,
			done: false,
			priority: input.priority ?? "medium",
			category: input.category ?? "other",
			owner: user.id,
			...(input.dueDate ? { dueDate: input.dueDate } : {}),
		},
		depth: 0,
		overrideAccess: false,
		user,
	});

	return mapPayloadTodo(todo);
}
