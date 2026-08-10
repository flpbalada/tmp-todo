import "server-only";

import type { Payload } from "payload";
import type { User } from "@/payload-types";
import type { Todo } from "../../types/todo";
import type { UpdateTodoInput } from "../../types/update-todo-input";
import { mapPayloadTodo } from "../map-payload-todo";

export async function updateTodo(
	payload: Payload,
	user: User,
	input: UpdateTodoInput,
): Promise<Todo | undefined> {
	const result = await payload.update({
		collection: "todos",
		data: {
			...(input.text !== undefined ? { text: input.text } : {}),
			...(input.priority !== undefined ? { priority: input.priority } : {}),
		},
		depth: 0,
		overrideAccess: false,
		user,
		where: {
			and: [{ id: { equals: input.id } }, { owner: { equals: user.id } }],
		},
	});
	const error = result.errors[0];
	if (error) throw new Error(error.message);

	const todo = result.docs[0];
	if (!todo) return undefined;

	return mapPayloadTodo(todo);
}
