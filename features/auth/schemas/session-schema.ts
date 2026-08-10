import { z } from "zod";

export const sessionSchema = z.object({
	user: z
		.object({
			id: z.string(),
			email: z.string(),
		})
		.nullable(),
});
