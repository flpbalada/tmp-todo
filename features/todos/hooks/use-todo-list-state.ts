import { useDeleteTodoMutation } from "../api/use-delete-todo-mutation";
import { usePendingCreateTodos } from "../api/use-pending-create-todos";
import { usePendingTodoIds } from "../api/use-pending-todo-ids";
import { useToggleTodoMutation } from "../api/use-toggle-todo-mutation";
import { useUpdateTodoMutation } from "../api/use-update-todo-mutation";
import type { Todo } from "../types/todo";
import type { ListTodosInput } from "../types/list-todos-input";
import { useTodoEditing } from "./use-todo-editing";

export function useTodoListState(todos: Todo[], input: ListTodosInput) {
	const editing = useTodoEditing();
	const pendingCreateTodos = usePendingCreateTodos(input);
	const pendingTodoIds = usePendingTodoIds();
	const updateTodo = useUpdateTodoMutation();
	const toggleTodo = useToggleTodoMutation();
	const deleteTodo = useDeleteTodoMutation();

	const saveEdit = (id: Todo["id"]) => {
		if (pendingTodoIds.has(id) || !editing.editText.trim()) return;

		updateTodo.clearUpdateError(id);
		updateTodo.mutation.mutate(
			{ id, text: editing.editText },
			{
				onSuccess: (result) => {
					if (result.success) {
						editing.cancelEdit();
						return;
					}

					updateTodo.setUpdateError({ id, message: "Task was not found." });
					reportMutationError(
						new Error(`Todo ${id} was not found during update.`),
					);
				},
				onError: (error) => {
					updateTodo.setUpdateError({ id, message: "Unable to update task." });
					reportMutationError(error);
				},
			},
		);
	};
	const updatePriority = (id: Todo["id"], priority: Todo["priority"]) => {
		if (pendingTodoIds.has(id)) return;

		updateTodo.clearUpdateError(id);
		updateTodo.mutation.mutate(
			{ id, priority },
			{
				onSuccess: (result) => {
					if (result.success) return;

					updateTodo.setUpdateError({ id, message: "Task was not found." });
					reportMutationError(
						new Error(`Todo ${id} was not found during update.`),
					);
				},
				onError: (error) => {
					updateTodo.setUpdateError({ id, message: "Unable to update task." });
					reportMutationError(error);
				},
			},
		);
	};
	const toggle = (id: Todo["id"], done: Todo["done"]) => {
		if (pendingTodoIds.has(id)) return;

		toggleTodo.clearToggleError(id);
		toggleTodo.mutation.mutate(
			{ id, done },
			{
				onSuccess: (result) => {
					if (result.success) return;

					toggleTodo.setToggleError({ id, message: "Task was not found." });
					reportMutationError(
						new Error(`Todo ${id} was not found during toggle.`),
					);
				},
				onError: (error) => {
					toggleTodo.setToggleError({ id, message: "Unable to update task." });
					reportMutationError(error);
				},
			},
		);
	};
	const remove = (id: Todo["id"]) => {
		if (pendingTodoIds.has(id)) return;

		deleteTodo.clearDeleteError(id);
		deleteTodo.mutation.mutate(
			{ id },
			{
				onSuccess: (result) => {
					if (result.success) return;

					deleteTodo.setDeleteError({ id, message: "Task was not found." });
					reportMutationError(
						new Error(`Todo ${id} was not found during deletion.`),
					);
				},
				onError: (error) => {
					deleteTodo.setDeleteError({ id, message: "Unable to delete task." });
					reportMutationError(error);
				},
			},
		);
	};
	const listItems = [
		...pendingCreateTodos.map(({ key, todo }) => ({
			key,
			todo,
			optimistic: true,
		})),
		...todos.map((todo) => ({ key: todo.id, todo, optimistic: false })),
	];

	return {
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
	};
}

function reportMutationError(error: unknown) {
	console.error(error);
	// TODO: Display a toast notification when shared notifications are available.
}
