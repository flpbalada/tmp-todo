import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { listTodosInputSchema } from "../schemas/list-todos-input-schema";
import type { ListTodosInput } from "../types/list-todos-input";
import type { TodoListData } from "../types/todo-list-data";
import type { TodoListSnapshots } from "../types/todo-list-snapshots";

function getListInput(queryKey: QueryKey): ListTodosInput | null {
	const input = listTodosInputSchema.safeParse(queryKey.at(-1));
	return input.success ? input.data : null;
}

export async function updateActiveTodoLists(
	queryClient: QueryClient,
	queryKey: QueryKey,
	update: (data: TodoListData, input: ListTodosInput) => TodoListData,
) {
	const filters = { queryKey, type: "active" as const };
	await queryClient.cancelQueries(filters);

	const activeLists = queryClient
		.getQueriesData<TodoListData>(filters)
		.filter((snapshot): snapshot is [QueryKey, TodoListData] =>
			Boolean(snapshot[1]),
		);
	const snapshots: TodoListSnapshots = [];

	for (const [cacheKey, before] of activeLists) {
		const input = getListInput(cacheKey);
		if (!input) continue;

		const after = update(before, input);
		snapshots.push({ queryKey: cacheKey, before, after });
		queryClient.setQueryData(cacheKey, after);
	}

	return snapshots;
}
