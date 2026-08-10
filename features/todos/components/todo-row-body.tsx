import { cn } from "@/lib/utils";
import type { TodoRowBodyProps } from "../types/todo-row-body-props";
import { TodoEditForm } from "./todo-edit-form";
import { TodoMetadata } from "./todo-metadata";

export function TodoRowBody({
	todo,
	categories,
	overdue,
	isEditing,
	editText,
	updatePending,
	updateError,
	toggleError,
	deleteError,
	onStartEdit,
	onEditTextChange,
	onSaveEdit,
	onCancelEdit,
}: TodoRowBodyProps) {
	return (
		<div className="flex-1 min-w-0">
			{isEditing ? (
				<TodoEditForm
					todoId={todo.id}
					editText={editText}
					updatePending={updatePending}
					onEditTextChange={onEditTextChange}
					onSaveEdit={onSaveEdit}
					onCancelEdit={onCancelEdit}
				/>
			) : (
				<>
					<button
						type="button"
						onClick={onStartEdit}
						className={cn(
							"block text-left text-sm font-medium cursor-pointer transition-colors",
							todo.done
								? "text-muted-foreground line-through decoration-white/20"
								: "text-foreground hover:text-violet-300",
						)}
					>
						{todo.text}
					</button>
					<TodoMetadata todo={todo} categories={categories} overdue={overdue} />
				</>
			)}
			{updateError?.id === todo.id && (
				<p role="alert" className="mt-2 text-xs text-red-300">
					{updateError.message}
				</p>
			)}
			{toggleError?.id === todo.id && (
				<p role="alert" className="mt-2 text-xs text-red-300">
					{toggleError.message}
				</p>
			)}
			{deleteError?.id === todo.id && (
				<p role="alert" className="mt-2 text-xs text-red-300">
					{deleteError.message}
				</p>
			)}
		</div>
	);
}
