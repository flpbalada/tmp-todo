import type { z } from "zod";
import type { createTodoInputSchema } from "../schemas/create-todo-input-schema";

export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;
