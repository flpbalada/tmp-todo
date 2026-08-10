import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodoRowProps } from "../types/todo-row-props";
import { isOverdue } from "../utils/is-overdue";
import { TodoRowActions } from "./todo-row-actions";
import { TodoRowBody } from "./todo-row-body";

export function TodoRow({
	todo,
	categories,
	isEditing,
	editText,
	updatePending,
	togglePending,
	deletePending,
	updateError,
	toggleError,
	deleteError,
	onToggle,
	onStartEdit,
	onEditTextChange,
	onSaveEdit,
	onCancelEdit,
	onPriorityChange,
	onDelete,
}: TodoRowProps) {
	const overdue = isOverdue(todo);

	return (
		<div
			className={cn(
				"group relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
				overdue
					? "bg-red-500/10 border-red-500/30"
					: "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20",
			)}
		>
			<button
				type="button"
				onClick={onToggle}
				disabled={togglePending}
				aria-label={
					todo.done
						? `Mark ${todo.text} as active`
						: `Mark ${todo.text} as complete`
				}
				className={cn(
					"shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300 disabled:opacity-50",
					todo.done
						? "bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
						: "border-muted-foreground hover:border-white",
				)}
			>
				{todo.done && (
					<Check
						aria-hidden="true"
						className="w-3 h-3 text-white"
						strokeWidth={4}
					/>
				)}
			</button>
			<TodoRowBody
				todo={todo}
				categories={categories}
				overdue={overdue}
				isEditing={isEditing}
				editText={editText}
				updatePending={updatePending}
				updateError={updateError}
				toggleError={toggleError}
				deleteError={deleteError}
				onStartEdit={onStartEdit}
				onEditTextChange={onEditTextChange}
				onSaveEdit={onSaveEdit}
				onCancelEdit={onCancelEdit}
			/>
			<TodoRowActions
				todo={todo}
				updatePending={updatePending}
				deletePending={deletePending}
				onPriorityChange={onPriorityChange}
				onDelete={onDelete}
			/>
		</div>
	);
}
