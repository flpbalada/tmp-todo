import { z } from "zod";
import { categorySchema } from "./category-schema";
import { dueDateSchema } from "./due-date-schema";
import { prioritySchema } from "./priority-schema";
import { todoTextSchema } from "./todo-text-schema";

export const createTodoInputSchema = z
	.object({
		text: todoTextSchema,
		priority: prioritySchema.optional(),
		category: categorySchema.optional(),
		dueDate: dueDateSchema.optional(),
	})
	.strict();
