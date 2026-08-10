import { todosRouter } from "@/features/todos/server";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
	todos: todosRouter,
});

export type AppRouter = typeof appRouter;
