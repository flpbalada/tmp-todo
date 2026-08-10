import type { CategoryInfo } from "./category-info";
import type { ListTodosInput } from "./list-todos-input";
import type { Todo } from "./todo";

export interface TodoListProps {
	todos: Todo[];
	categories: CategoryInfo[];
	activeFiltersCount: number;
	input: ListTodosInput;
	isPending: boolean;
	isError: boolean;
}
