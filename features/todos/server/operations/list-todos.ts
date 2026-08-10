import "server-only";

import type { Payload, Where } from "payload";
import type { User } from "@/payload-types";
import { todosPerPage } from "../../config/todos-per-page";
import type { ListTodosInput } from "../../types/list-todos-input";
import { categories } from "../categories";
import { mapPayloadTodo } from "../map-payload-todo";
import { getTodoStats } from "./get-todo-stats";

export async function listTodos(
	payload: Payload,
	user: User,
	input: ListTodosInput,
) {
	const options = {
		collection: "todos" as const,
		depth: 0,
		limit: todosPerPage,
		overrideAccess: false,
		sort: ["createdAt", "id"],
		user,
		where: getWhere(user, input),
	};
	const [requestedPage, stats] = await Promise.all([
		payload.find({ ...options, page: input.page }),
		getTodoStats(payload, user),
	]);
	const totalPages = Math.max(1, requestedPage.totalPages);
	const page = Math.min(input.page, totalPages);
	const result =
		page === input.page
			? requestedPage
			: await payload.find({ ...options, page });

	return {
		todos: result.docs.map(mapPayloadTodo),
		categories,
		stats,
		pagination: {
			page,
			totalItems: requestedPage.totalDocs,
			totalPages,
		},
	};
}

function getWhere(user: User, input: ListTodosInput): Where {
	const filters: Where[] = [{ owner: { equals: user.id } }];
	if (input.category && input.category !== "all") {
		filters.push({ category: { equals: input.category } });
	}

	if (input.priority && input.priority !== "all") {
		filters.push({ priority: { equals: input.priority } });
	}

	if (input.status === "completed") {
		filters.push({ done: { equals: true } });
	} else if (input.status === "active") {
		filters.push({ done: { equals: false } });
	}

	if (input.search) {
		filters.push({ text: { contains: input.search } });
	}

	return { and: filters };
}
