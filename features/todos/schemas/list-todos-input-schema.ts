import { z } from "zod";
import { categoryFilterSchema } from "./category-filter-schema";
import { priorityFilterSchema } from "./priority-filter-schema";
import { statusFilterSchema } from "./status-filter-schema";

export const listTodosInputSchema = z.object({
	category: categoryFilterSchema,
	priority: priorityFilterSchema,
	status: statusFilterSchema,
	search: z.string(),
	page: z.number().int().positive(),
});
