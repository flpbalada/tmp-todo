import { useMutationState } from "@tanstack/react-query";
import { useSessionQuery } from "@/features/auth/api/use-session-query";
import { getTodoId } from "../utils/get-todo-id";
import { getTodoMutationUserId } from "./todo-mutation-cache";

export function usePendingTodoIds() {
	const userId = useSessionQuery().data?.user?.id;
	const pendingIds = useMutationState({
		filters: { status: "pending" },
		select: (mutation) =>
			getTodoMutationUserId(mutation.options.meta) === userId
				? getTodoId(mutation.state.variables)
				: null,
	});

	// A Set deduplicates IDs and provides direct membership checks for each row.
	return new Set(pendingIds.filter((id): id is string => id !== null));
}
