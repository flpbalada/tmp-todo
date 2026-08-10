import type { CategoryInfo } from "./category-info";
import type { ItemError } from "./item-error";
import type { Todo } from "./todo";

export interface TodoRowBodyProps {
	todo: Todo;
	categories: CategoryInfo[];
	overdue: boolean;
	isEditing: boolean;
	editText: string;
	updatePending: boolean;
	updateError: ItemError | null;
	toggleError: ItemError | null;
	deleteError: ItemError | null;
	onStartEdit: () => void;
	onEditTextChange: (text: string) => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
}
