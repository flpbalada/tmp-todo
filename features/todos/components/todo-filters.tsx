import { X } from "lucide-react";
import { categoryFilterSchema } from "../schemas/category-filter-schema";
import { priorityFilterSchema } from "../schemas/priority-filter-schema";
import { statusFilterSchema } from "../schemas/status-filter-schema";
import type { TodoFiltersProps } from "../types/todo-filters-props";

export function TodoFilters({
	categories,
	category,
	priority,
	status,
	activeFiltersCount,
	onCategoryChange,
	onPriorityChange,
	onStatusChange,
	onClear,
}: TodoFiltersProps) {
	return (
		<div
			id="todo-filters"
			className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200"
		>
			<label className="sr-only" htmlFor="category-filter">
				Filter by category
			</label>
			<select
				id="category-filter"
				value={category}
				onChange={(event) => {
					const result = categoryFilterSchema.safeParse(event.target.value);
					if (!result.success) return;
					onCategoryChange(result.data);
				}}
				className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
			>
				<option value="all">All Categories</option>
				{categories.map((item) => (
					<option key={item.id} value={item.id}>
						{item.label}
					</option>
				))}
			</select>
			<label className="sr-only" htmlFor="priority-filter">
				Filter by priority
			</label>
			<select
				id="priority-filter"
				value={priority}
				onChange={(event) => {
					const result = priorityFilterSchema.safeParse(event.target.value);
					if (!result.success) return;
					onPriorityChange(result.data);
				}}
				className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
			>
				<option value="all">All Priorities</option>
				<option value="high">High</option>
				<option value="medium">Medium</option>
				<option value="low">Low</option>
			</select>
			<label className="sr-only" htmlFor="status-filter">
				Filter by status
			</label>
			<select
				id="status-filter"
				value={status}
				onChange={(event) => {
					const result = statusFilterSchema.safeParse(event.target.value);
					if (!result.success) return;
					onStatusChange(result.data);
				}}
				className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
			>
				<option value="all">All Status</option>
				<option value="active">Active</option>
				<option value="completed">Completed</option>
			</select>
			{activeFiltersCount > 0 && (
				<button
					type="button"
					onClick={onClear}
					className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
				>
					<X aria-hidden="true" className="w-3 h-3" /> Clear filters
				</button>
			)}
		</div>
	);
}
