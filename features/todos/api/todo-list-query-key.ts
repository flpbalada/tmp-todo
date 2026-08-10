export const todoListsQueryKey = ["todo-lists"] as const;

export function getTodoListsQueryKey(userId: string | undefined) {
	return [...todoListsQueryKey, userId ?? "anonymous"] as const;
}
