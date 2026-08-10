import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TodoPaginationProps } from "../types/todo-pagination-props";

export function TodoPagination({
	pagination,
	onPageChange,
}: TodoPaginationProps) {
	return (
		<nav
			aria-label="Task pagination"
			className="mb-6 flex items-center justify-center gap-3"
		>
			<button
				type="button"
				onClick={() => onPageChange(pagination.page - 1)}
				disabled={pagination.page === 1}
				aria-label="Previous page"
				className="rounded-lg border border-white/10 bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
			>
				<ChevronLeft aria-hidden="true" className="size-4" />
			</button>
			<span className="text-xs text-muted-foreground">
				Page {pagination.page} of {pagination.totalPages}
			</span>
			<button
				type="button"
				onClick={() => onPageChange(pagination.page + 1)}
				disabled={pagination.page === pagination.totalPages}
				aria-label="Next page"
				className="rounded-lg border border-white/10 bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
			>
				<ChevronRight aria-hidden="true" className="size-4" />
			</button>
		</nav>
	);
}
