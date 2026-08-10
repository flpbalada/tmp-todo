import config from "@payload-config";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getPayload } from "payload";

export async function createTRPCContext(options: FetchCreateContextFnOptions) {
	const payload = await getPayload({ config });
	const { user } = await payload.auth({ headers: options.req.headers });

	return { ...options, payload, user };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const trpc = initTRPC.context<TRPCContext>().create();

export const createTRPCRouter = trpc.router;
export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(({ ctx, next }) => {
	if (ctx.user?.collection !== "users") {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user,
		},
	});
});
