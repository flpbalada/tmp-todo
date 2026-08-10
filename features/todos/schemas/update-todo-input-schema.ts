import { z } from "zod";
import { prioritySchema } from "./priority-schema";
import { todoIdSchema } from "./todo-id-schema";
import { todoTextSchema } from "./todo-text-schema";

export const updateTodoInputSchema = z
	.object({
		id: todoIdSchema,
		text: todoTextSchema.optional(),
		priority: prioritySchema.optional(),
	})
	.strict()
	.refine((input) => input.text !== undefined || input.priority !== undefined, {
		message: "Text or priority is required",
	});
