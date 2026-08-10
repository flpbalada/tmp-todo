import type { z } from "zod";
import type { deleteTodoInputSchema } from "../schemas/delete-todo-input-schema";

export type DeleteTodoInput = z.infer<typeof deleteTodoInputSchema>;
