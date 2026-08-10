import { z } from "zod";

export const todoStatsSchema = z.object({
	total: z.number(),
	completed: z.number(),
	active: z.number(),
	overdue: z.number(),
});
