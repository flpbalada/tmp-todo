import { z } from "zod";

export const todoTextSchema = z.string().trim().min(1);
