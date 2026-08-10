"use client";

import { useState } from "react";
import type { TodoControlsProps } from "../types/todo-controls-props";
import { TodoFilters } from "./todo-filters";
import { TodoForm } from "./todo-form";
import { TodoToolbar } from "./todo-toolbar";

export function TodoControls({
	categories,
	searchQuery,
	category,
	priority,
	status,
	activeFiltersCount,
	onSearchChange,
	onCategoryChange,
	onPriorityChange,
	onStatusChange,
	onClearFilters,
}: TodoControlsProps) {
	const [showFilters, setShowFilters] = useState(false);
	const [showForm, setShowForm] = useState(false);

	return (
		<div className="mb-6 space-y-3">
			<TodoToolbar
				searchQuery={searchQuery}
				activeFiltersCount={activeFiltersCount}
				showFilters={showFilters}
				showForm={showForm}
				onSearchChange={onSearchChange}
				onToggleFilters={() => setShowFilters((visible) => !visible)}
				onToggleForm={() => setShowForm((visible) => !visible)}
			/>
			{showFilters && (
				<TodoFilters
					categories={categories}
					category={category}
					priority={priority}
					status={status}
					activeFiltersCount={activeFiltersCount}
					onCategoryChange={onCategoryChange}
					onPriorityChange={onPriorityChange}
					onStatusChange={onStatusChange}
					onClear={onClearFilters}
				/>
			)}
			{showForm && (
				<TodoForm categories={categories} onClose={() => setShowForm(false)} />
			)}
		</div>
	);
}
