import type { TodoListProps } from "../types/todo-list-props";
import { TodoList } from "./todo-list";

export function TodoListSection(props: TodoListProps) {
	return (
		<div className="space-y-2 mb-6 min-h-[200px] max-h-[400px] overflow-y-auto">
			<TodoList {...props} />
		</div>
	);
}
