import { z } from "zod";
import { prioritySchema } from "./priority-schema";

export const priorityFilterSchema = z.enum([...prioritySchema.options, "all"]);
