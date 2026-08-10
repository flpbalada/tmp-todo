import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "@/features/auth/types/session";
import { sessionQueryKey } from "@/features/auth/api/use-session-query";
import { getTodoListsQueryKey } from "./todo-list-query-key";

const userIdMetaKey = "todoUserId";

export function getTodoMutationMeta(userId: string | undefined) {
	return { [userIdMetaKey]: userId };
}

export function getTodoMutationUserId(
	meta: Record<string, unknown> | undefined,
) {
	const userId = meta?.[userIdMetaKey];
	return typeof userId === "string" ? userId : undefined;
}

export function isCurrentTodoUser(
	queryClient: QueryClient,
	userId: string | undefined,
) {
	const session = queryClient.getQueryData<Session>(sessionQueryKey);
	return Boolean(userId && session?.user?.id === userId);
}

export async function invalidateTodoListsWhenIdle(
	queryClient: QueryClient,
	userId: string | undefined,
) {
	if (!isCurrentTodoUser(queryClient, userId)) return;

	const pendingCount = queryClient.isMutating({
		predicate: (mutation) =>
			getTodoMutationUserId(mutation.options.meta) === userId,
	});
	if (pendingCount > 1) return;

	await queryClient.invalidateQueries({
		queryKey: getTodoListsQueryKey(userId),
	});
}

export function removeTodoMutationState(queryClient: QueryClient) {
	const mutationCache = queryClient.getMutationCache();
	for (const mutation of mutationCache.getAll()) {
		const mutationUserId = getTodoMutationUserId(mutation.options.meta);
		if (mutationUserId) {
			mutationCache.remove(mutation);
		}
	}
}
