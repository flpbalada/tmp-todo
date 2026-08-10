import { z } from "zod";

export const dueDateSchema = z.iso.date();
