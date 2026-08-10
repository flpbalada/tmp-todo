import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);
