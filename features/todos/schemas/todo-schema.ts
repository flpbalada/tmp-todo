import { z } from "zod";
import { categorySchema } from "./category-schema";
import { prioritySchema } from "./priority-schema";

export const todoSchema = z.object({
	id: z.string(),
	text: z.string(),
	done: z.boolean(),
	priority: prioritySchema,
	category: categorySchema,
	dueDate: z.string().optional(),
	createdAt: z.string(),
	completedAt: z.string().optional(),
});
