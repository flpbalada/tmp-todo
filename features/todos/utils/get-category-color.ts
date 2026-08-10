import type { Category } from "../types/category";
import type { CategoryInfo } from "../types/category-info";

export function getCategoryColor(
	categories: CategoryInfo[],
	category: Category,
) {
	return categories.find((item) => item.id === category)?.color ?? "#6b7280";
}
