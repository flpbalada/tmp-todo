import type { Category } from "./category";
import type { CategoryInfo } from "./category-info";
import type { Priority } from "./priority";

export interface TodoFiltersProps {
	categories: CategoryInfo[];
	category: Category | "all";
	priority: Priority | "all";
	status: "all" | "active" | "completed";
	activeFiltersCount: number;
	onCategoryChange: (category: Category | "all") => void;
	onPriorityChange: (priority: Priority | "all") => void;
	onStatusChange: (status: "all" | "active" | "completed") => void;
	onClear: () => void;
}
