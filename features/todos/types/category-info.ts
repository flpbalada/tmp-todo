import type { z } from "zod";
import type { categoryInfoSchema } from "../schemas/category-info-schema";

export type CategoryInfo = z.infer<typeof categoryInfoSchema>;
