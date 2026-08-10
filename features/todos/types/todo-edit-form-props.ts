import type { Todo } from "./todo";

export interface TodoEditFormProps {
	todoId: Todo["id"];
	editText: string;
	updatePending: boolean;
	onEditTextChange: (text: string) => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
}
