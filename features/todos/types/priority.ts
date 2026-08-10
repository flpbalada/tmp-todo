import type { z } from "zod";
import type { prioritySchema } from "../schemas/priority-schema";

export type Priority = z.infer<typeof prioritySchema>;
