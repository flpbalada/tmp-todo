"use client";

import { useTodoListState } from "../hooks/use-todo-list-state";
import type { TodoListProps } from "../types/todo-list-props";
import { TodoListEmpty } from "./todo-list-empty";
import { TodoListError } from "./todo-list-error";
import { TodoListLoading } from "./todo-list-loading";
import { TodoRow } from "./todo-row";

export function TodoList({
	todos,
	categories,
	activeFiltersCount,
	input,
	isPending,
	isError,
}: TodoListProps) {
	const {
		editing,
		updateTodo,
		toggleTodo,
		deleteTodo,
		pendingTodoIds,
		saveEdit,
		updatePriority,
		toggle,
		remove,
		listItems,
	} = useTodoListState(todos, input);

	if (isPending) return <TodoListLoading />;
	if (isError) return <TodoListError />;
	if (listItems.length === 0) {
		return <TodoListEmpty activeFiltersCount={activeFiltersCount} />;
	}

	return (
		<div className="space-y-2">
			{listItems.map(({ key, todo, optimistic }) => {
				const itemPending = optimistic || pendingTodoIds.has(todo.id);

				return (
					<TodoRow
						key={key}
						todo={todo}
						categories={categories}
						isEditing={editing.editingId === todo.id}
						editText={editing.editText}
						updatePending={itemPending}
						togglePending={itemPending}
						deletePending={itemPending}
						updateError={updateTodo.updateError}
						toggleError={toggleTodo.toggleError}
						deleteError={deleteTodo.deleteError}
						onToggle={() => {
							if (!optimistic) toggle(todo.id, !todo.done);
						}}
						onStartEdit={() => {
							if (!optimistic) editing.startEdit(todo);
						}}
						onEditTextChange={editing.setEditText}
						onSaveEdit={() => saveEdit(todo.id)}
						onCancelEdit={editing.cancelEdit}
						onPriorityChange={(priority) => {
							if (!optimistic) updatePriority(todo.id, priority);
						}}
						onDelete={() => {
							if (!optimistic) remove(todo.id);
						}}
					/>
				);
			})}
		</div>
	);
}
