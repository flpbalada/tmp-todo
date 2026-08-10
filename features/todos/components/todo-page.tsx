"use client";

import { useEffect } from "react";
import { useTodosQuery } from "../api/use-todos-query";
import { emptyTodoStats } from "../config/empty-todo-stats";
import { useSyncTodoPage } from "../hooks/use-sync-todo-page";
import { useTodoFilters } from "../hooks/use-todo-filters";
import { TodoControls } from "./todo-controls";
import { TodoHeader } from "./todo-header";
import { TodoKeyboardHint } from "./todo-keyboard-hint";
import { TodoListSection } from "./todo-list-section";
import { TodoPagination } from "./todo-pagination";
import { TodoStats } from "./todo-stats";
import { TodoVersionBadge } from "./todo-version-badge";

export function TodoPage() {
	const filters = useTodoFilters();
	const input = {
		category: filters.queryState.category,
		priority: filters.queryState.priority,
		status: filters.queryState.status,
		search: filters.debouncedSearchQuery,
		page: filters.queryState.page,
	};
	const todoQuery = useTodosQuery(input);

	useEffect(() => {
		if (!todoQuery.error) return;
		//TODO add toast
		console.log(todoQuery.error);
	}, [todoQuery.error]);

	const { todos, categories, stats, pagination } = todoQuery.data ?? {
		todos: [],
		categories: [],
		stats: emptyTodoStats,
		pagination: {
			page: filters.queryState.page,
			totalItems: 0,
			totalPages: 1,
		},
	};

	useSyncTodoPage(
		todoQuery.isSuccess,
		pagination.page,
		filters.queryState.page,
		filters.setPage,
	);

	return (
		<main className="min-h-screen flex items-center justify-center p-4">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none"
			/>
			<div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
				<div className="glass-card rounded-2xl p-4 sm:p-8">
					<TodoHeader />
					{todoQuery.isSuccess && <TodoStats stats={stats} />}
					<TodoControls
						categories={categories}
						searchQuery={filters.queryState.q}
						category={filters.queryState.category}
						priority={filters.queryState.priority}
						status={filters.queryState.status}
						activeFiltersCount={filters.activeFiltersCount}
						onSearchChange={filters.setSearch}
						onCategoryChange={filters.setCategory}
						onPriorityChange={filters.setPriority}
						onStatusChange={filters.setStatus}
						onClearFilters={filters.clearFilters}
					/>
					<TodoListSection
						todos={todos}
						categories={categories}
						activeFiltersCount={filters.activeFiltersCount}
						input={input}
						isPending={todoQuery.isPending}
						isError={todoQuery.isError}
					/>
					{todoQuery.isSuccess && pagination.totalPages > 1 && (
						<TodoPagination
							pagination={pagination}
							onPageChange={filters.setPage}
						/>
					)}
					<TodoKeyboardHint />
				</div>
				<TodoVersionBadge />
			</div>
		</main>
	);
}
