import type { z } from "zod";
import type { listTodosInputSchema } from "../schemas/list-todos-input-schema";

export type ListTodosInput = z.infer<typeof listTodosInputSchema>;
