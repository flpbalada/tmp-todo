import "server-only";

import type { Payload } from "payload";
import type { User } from "@/payload-types";
import type { Todo } from "../../types/todo";
import type { ToggleTodoInput } from "../../types/toggle-todo-input";
import { mapPayloadTodo } from "../map-payload-todo";

export async function toggleTodo(
	payload: Payload,
	user: User,
	input: ToggleTodoInput,
): Promise<Todo | undefined> {
	const result = await payload.update({
		collection: "todos",
		data: { done: input.done },
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
