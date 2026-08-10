import type { CategoryInfo } from "./category-info";
import type { Todo } from "./todo";
import type { TodoPagination } from "./todo-pagination";
import type { TodoStats } from "./todo-stats";

export interface TodoListData {
	todos: Todo[];
	categories: CategoryInfo[];
	stats: TodoStats;
	pagination: TodoPagination;
}
