import type { z } from "zod";
import type { signInInputSchema } from "../schemas/sign-in-input-schema";

export type SignInInput = z.infer<typeof signInInputSchema>;
