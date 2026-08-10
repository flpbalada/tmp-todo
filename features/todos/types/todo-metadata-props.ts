import type { CategoryInfo } from "./category-info";
import type { Todo } from "./todo";

export interface TodoMetadataProps {
	todo: Todo;
	categories: CategoryInfo[];
	overdue: boolean;
}
