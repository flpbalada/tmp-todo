import "server-only";

import type { Payload } from "payload";
import type { User } from "@/payload-types";
import type { TodoStats } from "../../types/todo-stats";

export async function getTodoStats(
	payload: Payload,
	user: User,
): Promise<TodoStats> {
	const owner = { owner: { equals: user.id } };
	const options = {
		collection: "todos" as const,
		overrideAccess: false,
		user,
	};
	const [total, completed, active, overdue] = await Promise.all([
		payload.count({ ...options, where: owner }),
		payload.count({
			...options,
			where: { and: [owner, { done: { equals: true } }] },
		}),
		payload.count({
			...options,
			where: { and: [owner, { done: { equals: false } }] },
		}),
		payload.count({
			...options,
			where: {
				and: [
					owner,
					{ done: { equals: false } },
					{
						dueDate: {
							less_than_equal: new Date().toISOString().slice(0, 10),
						},
					},
				],
			},
		}),
	]);

	return {
		total: total.totalDocs,
		completed: completed.totalDocs,
		active: active.totalDocs,
		overdue: overdue.totalDocs,
	};
}
