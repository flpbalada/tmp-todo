import { Filter, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodoToolbarProps } from "../types/todo-toolbar-props";

export function TodoToolbar({
	searchQuery,
	activeFiltersCount,
	showFilters,
	showForm,
	onSearchChange,
	onToggleFilters,
	onToggleForm,
}: TodoToolbarProps) {
	return (
		<div className="flex flex-wrap gap-2 sm:flex-nowrap">
			<div className="relative basis-full sm:flex-1 sm:basis-auto">
				<Search
					aria-hidden="true"
					className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
				/>
				<label className="sr-only" htmlFor="todo-search">
					Search tasks
				</label>
				<input
					id="todo-search"
					type="search"
					value={searchQuery}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Search tasks..."
					className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
				/>
			</div>
			<button
				type="button"
				onClick={onToggleFilters}
				aria-expanded={showFilters}
				aria-controls="todo-filters"
				aria-label="Toggle task filters"
				className={cn(
					"flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
					showFilters || activeFiltersCount > 0
						? "bg-violet-500/20 border-violet-500/50 text-violet-300"
						: "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10",
				)}
			>
				<Filter aria-hidden="true" className="w-4 h-4" />
				{activeFiltersCount > 0 && (
					<span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
						{activeFiltersCount}
					</span>
				)}
			</button>
			<button
				type="button"
				onClick={onToggleForm}
				aria-expanded={showForm}
				className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20"
			>
				<Plus aria-hidden="true" className="w-4 h-4" />
				<span className="text-sm font-medium">Add Task</span>
			</button>
		</div>
	);
}
