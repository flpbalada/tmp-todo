"use client";

import { useState } from "react";
import type { Todo } from "../types/todo";

export function useTodoEditing() {
	const [editingId, setEditingId] = useState<Todo["id"] | null>(null);
	const [editText, setEditText] = useState("");

	return {
		editingId,
		editText,
		setEditText,
		startEdit: (todo: Todo) => {
			setEditingId(todo.id);
			setEditText(todo.text);
		},
		cancelEdit: () => setEditingId(null),
	};
}
