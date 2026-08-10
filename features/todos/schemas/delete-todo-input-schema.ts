import { z } from "zod";
import { todoIdSchema } from "./todo-id-schema";

export const deleteTodoInputSchema = z.object({ id: todoIdSchema }).strict();
