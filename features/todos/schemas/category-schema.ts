import { z } from "zod";

export const categorySchema = z.enum([
	"personal",
	"work",
	"shopping",
	"health",
	"other",
]);
