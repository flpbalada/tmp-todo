import { z } from "zod";
import { categorySchema } from "./category-schema";

export const categoryInfoSchema = z.object({
	id: categorySchema,
	label: z.string(),
	color: z.string(),
});
