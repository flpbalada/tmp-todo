import { z } from "zod";
import { categorySchema } from "./category-schema";

export const categoryFilterSchema = z.enum([...categorySchema.options, "all"]);
