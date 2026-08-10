import type { z } from "zod";
import type { toggleTodoInputSchema } from "../schemas/toggle-todo-input-schema";

export type ToggleTodoInput = z.infer<typeof toggleTodoInputSchema>;
