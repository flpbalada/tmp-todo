import type { z } from "zod";
import type { todoStatsSchema } from "../schemas/todo-stats-schema";

export type TodoStats = z.infer<typeof todoStatsSchema>;
