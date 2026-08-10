import type { Access, CollectionConfig } from "payload";

import { dueDateSchema } from "../features/todos/schemas/due-date-schema.ts";
import { isAdmin, isAppUser } from "./access.ts";

const readableByAdminOrOwner: Access = ({ req }) => {
	if (isAdmin(req.user)) {
		return true;
	}

	if (!isAppUser(req.user)) {
		return false;
	}

	return {
		owner: {
			equals: req.user.id,
		},
	};
};

const ownedByAppUser: Access = ({ req }) => {
	if (!isAppUser(req.user)) {
		return false;
	}

	return {
		owner: {
			equals: req.user.id,
		},
	};
};

export const Todos: CollectionConfig = {
	slug: "todos",
	admin: {
		useAsTitle: "text",
	},
	access: {
		create: ({ req }) => isAppUser(req.user),
		delete: ownedByAppUser,
		read: readableByAdminOrOwner,
		update: ownedByAppUser,
	},
	defaultSort: "createdAt",
	hooks: {
		beforeOperation: [
			({ args, operation }) => {
				if (operation !== "read" || !("sort" in args) || args.sort) {
					return args;
				}

				args.sort = "createdAt";
				return args;
			},
		],
		beforeChange: [
			({ data, operation, originalDoc, req }) => {
				if (!isAppUser(req.user)) {
					throw new Error(
						"An authenticated app user is required to save a todo",
					);
				}

				if (operation === "create") {
					data.owner = req.user.id;
					data.done = false;
					data.completedAt = null;
					return data;
				}

				data.owner = originalDoc.owner;

				if (typeof data.done !== "boolean" || data.done === originalDoc.done) {
					data.completedAt = originalDoc.completedAt;
					return data;
				}

				data.completedAt = data.done ? new Date().toISOString() : null;
				return data;
			},
		],
	},
	fields: [
		{
			name: "text",
			type: "text",
			required: true,
			validate: (value: unknown) =>
				typeof value === "string" && value.trim().length > 0
					? true
					: "Text is required",
			hooks: {
				beforeChange: [
					({ value }) => (typeof value === "string" ? value.trim() : value),
				],
			},
		},
		{
			name: "done",
			type: "checkbox",
			defaultValue: false,
			required: true,
		},
		{
			name: "priority",
			type: "select",
			defaultValue: "medium",
			options: ["low", "medium", "high"],
			required: true,
		},
		{
			name: "category",
			type: "select",
			defaultValue: "other",
			options: ["personal", "work", "shopping", "health", "other"],
			required: true,
		},
		{
			name: "dueDate",
			// Payload date fields serialize timestamps, but the frontend requires YYYY-MM-DD.
			type: "text",
			validate: (value: unknown) =>
				value === null ||
				value === undefined ||
				dueDateSchema.safeParse(value).success
					? true
					: "Due date must use YYYY-MM-DD format",
		},
		{
			name: "completedAt",
			type: "date",
			admin: {
				readOnly: true,
			},
		},
		{
			name: "owner",
			type: "relationship",
			admin: {
				readOnly: true,
			},
			index: true,
			relationTo: "users",
			required: true,
		},
	],
	timestamps: true,
};
