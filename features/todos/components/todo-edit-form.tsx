import type { TodoEditFormProps } from "../types/todo-edit-form-props";

export function TodoEditForm({
	todoId,
	editText,
	updatePending,
	onEditTextChange,
	onSaveEdit,
	onCancelEdit,
}: TodoEditFormProps) {
	return (
		<div className="flex flex-wrap gap-2">
			<label className="sr-only" htmlFor={`edit-todo-${todoId}`}>
				Task description
			</label>
			<input
				id={`edit-todo-${todoId}`}
				type="text"
				value={editText}
				onChange={(event) => onEditTextChange(event.target.value)}
				onKeyDown={(event) => event.key === "Enter" && onSaveEdit()}
				disabled={updatePending}
				className="min-w-0 flex-1 bg-white/10 border border-white/20 rounded-sm px-2 py-1 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
			/>
			<button
				type="button"
				onClick={onSaveEdit}
				disabled={updatePending}
				className="text-green-400 hover:text-green-300 text-sm disabled:opacity-50"
			>
				Save
			</button>
			<button
				type="button"
				onClick={onCancelEdit}
				disabled={updatePending}
				className="text-muted-foreground hover:text-white text-sm disabled:opacity-50"
			>
				Cancel
			</button>
		</div>
	);
}
