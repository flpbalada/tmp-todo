import "server-only";

import type { Payload } from "payload";
import type { User } from "@/payload-types";
import type { Todo } from "../../types/todo";

export async function deleteTodo(
	payload: Payload,
	user: User,
	id: Todo["id"],
): Promise<boolean> {
	const result = await payload.delete({
		collection: "todos",
		depth: 0,
		overrideAccess: false,
		user,
		where: {
			and: [{ id: { equals: id } }, { owner: { equals: user.id } }],
		},
	});
	const error = result.errors[0];
	if (error) throw new Error(error.message);

	return result.docs.length > 0;
}
