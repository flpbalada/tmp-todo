import { Trash2 } from "lucide-react";
import { prioritySchema } from "../schemas/priority-schema";
import type { TodoRowActionsProps } from "../types/todo-row-actions-props";

export function TodoRowActions({
	todo,
	updatePending,
	deletePending,
	onPriorityChange,
	onDelete,
}: TodoRowActionsProps) {
	return (
		<div className="flex items-center gap-1 transition-opacity pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100">
			<label className="sr-only" htmlFor={`priority-${todo.id}`}>
				Priority for {todo.text}
			</label>
			<select
				id={`priority-${todo.id}`}
				value={todo.priority}
				onChange={(event) => {
					const priority = prioritySchema.safeParse(event.target.value);
					if (!priority.success) return;
					onPriorityChange(priority.data);
				}}
				disabled={updatePending}
				className="bg-white/10 border-0 rounded-sm text-xs py-1 px-1 focus:outline-hidden focus:ring-1 focus:ring-violet-500/50 cursor-pointer disabled:opacity-50"
			>
				<option value="low">Low</option>
				<option value="medium">Med</option>
				<option value="high">High</option>
			</select>
			<button
				type="button"
				onClick={onDelete}
				disabled={deletePending}
				aria-label={`Delete ${todo.text}`}
				className="p-1.5 hover:bg-red-500/20 rounded-lg text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
			>
				<Trash2 aria-hidden="true" className="w-4 h-4" />
			</button>
		</div>
	);
}
