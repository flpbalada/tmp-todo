"use client";

import { useDebounce } from "@uidotdev/usehooks";
import { useQueryStates } from "nuqs";
import { todoQueryParsers } from "../config/todo-query-parsers";
import type { Category } from "../types/category";
import type { Priority } from "../types/priority";

export function useTodoFilters() {
	const [queryState, setQueryState] = useQueryStates(todoQueryParsers);
	const debouncedSearchQuery = useDebounce(queryState.q, 300);
	const activeFiltersCount = [
		queryState.category !== "all",
		queryState.priority !== "all",
		queryState.status !== "all",
		queryState.q !== "",
	].filter(Boolean).length;

	return {
		queryState,
		debouncedSearchQuery,
		activeFiltersCount,
		setSearch: (q: string) => setQueryState({ q, page: 1 }),
		setCategory: (category: Category | "all") =>
			setQueryState({ category, page: 1 }),
		setPriority: (priority: Priority | "all") =>
			setQueryState({ priority, page: 1 }),
		setStatus: (status: "all" | "active" | "completed") =>
			setQueryState({ status, page: 1 }),
		setPage: (page: number) => setQueryState({ page }),
		clearFilters: () => setQueryState(null),
	};
}
