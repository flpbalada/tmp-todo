import type { TodoPagination } from "./todo-pagination";

export interface TodoPaginationProps {
	pagination: TodoPagination;
	onPageChange: (page: number) => void;
}
