import { z } from "zod";

export const statusFilterSchema = z.enum(["all", "active", "completed"]);
