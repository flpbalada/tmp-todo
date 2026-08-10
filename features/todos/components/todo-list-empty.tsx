import type { TodoListEmptyProps } from "../types/todo-list-empty-props";

export function TodoListEmpty({ activeFiltersCount }: TodoListEmptyProps) {
	return (
		<div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
			<p className="text-muted-foreground">
				{activeFiltersCount > 0
					? "No tasks match your filters."
					: "No tasks yet. Add one above!"}
			</p>
		</div>
	);
}
