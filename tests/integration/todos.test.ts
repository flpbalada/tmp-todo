import { randomUUID } from "node:crypto";
import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { Admin, User } from "@/payload-types";
import { appRouter } from "@/trpc/router";

const password = "integration-test-password";
const defaultListInput = {
	category: "all" as const,
	priority: "all" as const,
	status: "all" as const,
	search: "",
	page: 1,
};

let payload: Payload;
let admin: Admin | undefined;
let primaryUser: User | undefined;
let secondaryUser: User | undefined;

function callerFor(user: User | null) {
	const req = new Request("http://localhost/api/trpc");

	return appRouter.createCaller({
		payload,
		user,
		req,
		resHeaders: new Headers(),
		info: {
			accept: null,
			type: "unknown",
			isBatchCall: false,
			calls: [],
			connectionParams: null,
			signal: req.signal,
			url: new URL(req.url),
		},
	});
}

async function createTodo(
	user: User,
	text: string,
	options: {
		category?: "personal" | "work" | "shopping" | "health" | "other";
		priority?: "low" | "medium" | "high";
		dueDate?: string;
	} = {},
) {
	return callerFor(user).todos.create({ text, ...options });
}

async function deleteFixtureTodos() {
	const ownerIds = [primaryUser?.id, secondaryUser?.id].filter(
		(id): id is string => Boolean(id),
	);
	if (ownerIds.length === 0) return;

	await payload.delete({
		collection: "todos",
		overrideAccess: true,
		where: { owner: { in: ownerIds } },
	});
}

beforeAll(async () => {
	try {
		payload = await getPayload({ config });
		await payload.count({ collection: "todos", overrideAccess: true });
	} catch (error) {
		throw new Error(
			"Todo integration tests require a running PostgreSQL database with Payload migrations applied. Run `docker compose up -d` and `pnpm payload:migrate`.",
			{ cause: error },
		);
	}

	const fixtureId = randomUUID();
	admin = await payload.create({
		collection: "admins",
		data: { email: `vitest-admin-${fixtureId}@example.com`, password },
		overrideAccess: true,
	});
	primaryUser = await payload.create({
		collection: "users",
		data: { email: `vitest-user-a-${fixtureId}@example.com`, password },
		overrideAccess: false,
		user: admin,
	});
	secondaryUser = await payload.create({
		collection: "users",
		data: { email: `vitest-user-b-${fixtureId}@example.com`, password },
		overrideAccess: false,
		user: admin,
	});
});

afterEach(deleteFixtureTodos);

afterAll(async () => {
	if (!payload) return;

	await deleteFixtureTodos();
	for (const user of [primaryUser, secondaryUser]) {
		if (!user) continue;
		await payload.delete({
			collection: "users",
			id: user.id,
			overrideAccess: true,
		});
	}
	if (admin) {
		await payload.delete({
			collection: "admins",
			id: admin.id,
			overrideAccess: true,
		});
	}

	await payload.destroy();
});

describe("todos tRPC integration", () => {
	test("rejects unauthenticated callers", async () => {
		await expect(
			callerFor(null).todos.list(defaultListInput),
		).rejects.toMatchObject({ code: "UNAUTHORIZED" });
	});

	test("creates a trimmed todo with defaults and the authenticated owner", async () => {
		const user = primaryUser as User;
		const todo = await createTodo(user, "  Prepare assignment  ");

		expect(todo).toMatchObject({
			text: "Prepare assignment",
			done: false,
			priority: "medium",
			category: "other",
		});
		expect(todo.completedAt).toBeUndefined();

		const persisted = await payload.findByID({
			collection: "todos",
			id: todo.id,
			depth: 0,
			overrideAccess: true,
		});
		expect(persisted.owner).toBe(user.id);
	});

	test("filters, paginates, and returns owner-wide statistics", async () => {
		const user = primaryUser as User;
		const caller = callerFor(user);
		const activeWorkTodo = await createTodo(user, "Alpha work", {
			category: "work",
			priority: "high",
		});
		const completedWorkTodo = await createTodo(user, "Alpha completed", {
			category: "work",
			priority: "high",
		});
		await caller.todos.toggle({ id: completedWorkTodo.id, done: true });
		await createTodo(user, "Shopping milk", {
			category: "shopping",
			priority: "low",
		});
		await createTodo(user, "Health appointment", { category: "health" });
		await createTodo(user, "Personal note", {
			category: "personal",
			priority: "low",
		});
		await createTodo(user, "Extra work", { category: "work" });

		const firstPage = await caller.todos.list(defaultListInput);
		expect(firstPage.todos).toHaveLength(4);
		expect(firstPage.pagination).toEqual({
			page: 1,
			totalItems: 6,
			totalPages: 2,
		});
		expect(firstPage.stats).toMatchObject({
			total: 6,
			completed: 1,
			active: 5,
		});
		expect(firstPage.todos.map((todo) => todo.createdAt)).toEqual(
			firstPage.todos.map((todo) => todo.createdAt).toSorted(),
		);

		const lastPage = await caller.todos.list({
			...defaultListInput,
			page: 99,
		});
		expect(lastPage.pagination.page).toBe(2);
		expect(lastPage.todos).toHaveLength(2);

		const filtered = await caller.todos.list({
			...defaultListInput,
			category: "work",
			priority: "high",
			status: "active",
			search: "Alpha",
		});
		expect(filtered.todos.map((todo) => todo.id)).toEqual([activeWorkTodo.id]);
		expect(filtered.stats.total).toBe(6);
	});

	test("updates and toggles the completion lifecycle", async () => {
		const user = primaryUser as User;
		const caller = callerFor(user);
		const todo = await createTodo(user, "Initial text", { priority: "low" });

		const updated = await caller.todos.update({
			id: todo.id,
			text: "  Updated text  ",
			priority: "high",
		});
		expect(updated).toMatchObject({
			success: true,
			data: { text: "Updated text", priority: "high" },
		});

		const completed = await caller.todos.toggle({ id: todo.id, done: true });
		expect(completed.success).toBe(true);
		if (!completed.success) throw new Error("Expected todo to be completed");
		expect(completed.data.done).toBe(true);
		expect(new Date(completed.data.completedAt ?? "").getTime()).not.toBeNaN();

		const active = await caller.todos.toggle({ id: todo.id, done: false });
		expect(active.success).toBe(true);
		if (!active.success) throw new Error("Expected todo to be active");
		expect(active.data.done).toBe(false);
		expect(active.data.completedAt).toBeUndefined();
	});

	test("does not expose or mutate another user's todos", async () => {
		const owner = primaryUser as User;
		const otherUser = secondaryUser as User;
		const todo = await createTodo(owner, "Private todo");
		const otherCaller = callerFor(otherUser);

		const list = await otherCaller.todos.list(defaultListInput);
		expect(list.todos).toEqual([]);
		expect(list.stats.total).toBe(0);
		await expect(
			otherCaller.todos.update({ id: todo.id, text: "Changed" }),
		).resolves.toEqual({ success: false, error: "NOT_FOUND" });
		await expect(
			otherCaller.todos.toggle({ id: todo.id, done: true }),
		).resolves.toEqual({ success: false, error: "NOT_FOUND" });
		await expect(otherCaller.todos.delete({ id: todo.id })).resolves.toEqual({
			success: false,
			error: "NOT_FOUND",
		});
	});

	test("deletes owned todos and returns not found for missing ids", async () => {
		const user = primaryUser as User;
		const caller = callerFor(user);
		const todo = await createTodo(user, "Delete me");

		await expect(caller.todos.delete({ id: todo.id })).resolves.toEqual({
			success: true,
			data: { id: todo.id },
		});
		await expect(caller.todos.delete({ id: randomUUID() })).resolves.toEqual({
			success: false,
			error: "NOT_FOUND",
		});
	});

	test("rejects invalid input at the tRPC boundary", async () => {
		const caller = callerFor(primaryUser as User);

		await expect(caller.todos.create({ text: "   " })).rejects.toMatchObject({
			code: "BAD_REQUEST",
		});
		await expect(
			caller.todos.update({ id: randomUUID() }),
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
		await expect(
			caller.todos.list({ ...defaultListInput, page: 0 }),
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
	});
});
