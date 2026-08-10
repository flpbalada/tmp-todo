import { z } from "zod";
import { todoIdSchema } from "./todo-id-schema";

export const toggleTodoInputSchema = z
	.object({ id: todoIdSchema, done: z.boolean() })
	.strict();
