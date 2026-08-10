import type { Priority } from "./priority";
import type { Todo } from "./todo";

export interface TodoRowActionsProps {
	todo: Todo;
	updatePending: boolean;
	deletePending: boolean;
	onPriorityChange: (priority: Priority) => void;
	onDelete: () => void;
}
