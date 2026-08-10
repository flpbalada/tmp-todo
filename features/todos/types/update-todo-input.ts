import type { z } from "zod";
import type { updateTodoInputSchema } from "../schemas/update-todo-input-schema";

export type UpdateTodoInput = z.infer<typeof updateTodoInputSchema>;
