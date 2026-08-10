import "server-only";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createTodoInputSchema } from "../schemas/create-todo-input-schema";
import { deleteTodoInputSchema } from "../schemas/delete-todo-input-schema";
import { listTodosInputSchema } from "../schemas/list-todos-input-schema";
import { toggleTodoInputSchema } from "../schemas/toggle-todo-input-schema";
import { updateTodoInputSchema } from "../schemas/update-todo-input-schema";
import { notFoundResult } from "./not-found-result";
import { createTodo } from "./operations/create-todo";
import { deleteTodo } from "./operations/delete-todo";
import { listTodos } from "./operations/list-todos";
import { toggleTodo } from "./operations/toggle-todo";
import { updateTodo } from "./operations/update-todo";

export const todosRouter = createTRPCRouter({
	list: protectedProcedure
		.input(listTodosInputSchema)
		.query(({ ctx, input }) => {
			return listTodos(ctx.payload, ctx.user, input);
		}),
	create: protectedProcedure
		.input(createTodoInputSchema)
		.mutation(({ ctx, input }) => {
			return createTodo(ctx.payload, ctx.user, input);
		}),
	update: protectedProcedure
		.input(updateTodoInputSchema)
		.mutation(async ({ ctx, input }) => {
			const todo = await updateTodo(ctx.payload, ctx.user, input);
			if (!todo) return notFoundResult;

			return { success: true, data: todo } as const;
		}),
	toggle: protectedProcedure
		.input(toggleTodoInputSchema)
		.mutation(async ({ ctx, input }) => {
			const todo = await toggleTodo(ctx.payload, ctx.user, input);
			if (!todo) return notFoundResult;

			return { success: true, data: todo } as const;
		}),
	delete: protectedProcedure
		.input(deleteTodoInputSchema)
		.mutation(async ({ ctx, input }) => {
			if (!(await deleteTodo(ctx.payload, ctx.user, input.id))) {
				return notFoundResult;
			}

			return { success: true, data: { id: input.id } } as const;
		}),
});
