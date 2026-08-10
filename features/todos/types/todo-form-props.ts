import type { CategoryInfo } from "./category-info";

export interface TodoFormProps {
	categories: CategoryInfo[];
	onClose: () => void;
}
