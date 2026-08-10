import type { CategoryInfo } from "./category-info";
import type { ItemError } from "./item-error";
import type { Priority } from "./priority";
import type { Todo } from "./todo";

export interface TodoRowProps {
	todo: Todo;
	categories: CategoryInfo[];
	isEditing: boolean;
	editText: string;
	updatePending: boolean;
	togglePending: boolean;
	deletePending: boolean;
	updateError: ItemError | null;
	toggleError: ItemError | null;
	deleteError: ItemError | null;
	onToggle: () => void;
	onStartEdit: () => void;
	onEditTextChange: (text: string) => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
	onPriorityChange: (priority: Priority) => void;
	onDelete: () => void;
}
