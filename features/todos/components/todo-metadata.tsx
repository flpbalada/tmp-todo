import { AlertCircle, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { priorityConfig } from "../config/priority-config";
import type { TodoMetadataProps } from "../types/todo-metadata-props";
import { formatDate } from "../utils/format-date";
import { getCategoryColor } from "../utils/get-category-color";

export function TodoMetadata({ todo, categories, overdue }: TodoMetadataProps) {
	const categoryColor = getCategoryColor(categories, todo.category);

	return (
		<div className="flex flex-wrap items-center gap-2 mt-1.5">
			<span
				className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
				style={{
					backgroundColor: `${categoryColor}20`,
					color: categoryColor,
				}}
			>
				<Tag aria-hidden="true" className="w-3 h-3" />
				{categories.find((category) => category.id === todo.category)?.label ??
					todo.category}
			</span>
			<span
				className={cn(
					"inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
					priorityConfig[todo.priority].bg,
					priorityConfig[todo.priority].color,
				)}
			>
				{priorityConfig[todo.priority].label}
			</span>
			{todo.dueDate && (
				<span
					className={cn(
						"inline-flex items-center gap-1 text-xs",
						overdue ? "text-red-400" : "text-muted-foreground",
					)}
				>
					{overdue ? (
						<AlertCircle aria-hidden="true" className="w-3 h-3" />
					) : (
						<Calendar aria-hidden="true" className="w-3 h-3" />
					)}
					{formatDate(todo.dueDate)}
				</span>
			)}
		</div>
	);
}
