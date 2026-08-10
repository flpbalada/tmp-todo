import type { CollectionConfig } from "payload";

import { isAdmin } from "./access.ts";

export const Admins: CollectionConfig = {
	slug: "admins",
	admin: {
		useAsTitle: "email",
	},
	auth: true,
	access: {
		admin: ({ req }) => isAdmin(req.user),
		create: ({ req }) => isAdmin(req.user),
		delete: ({ req }) => isAdmin(req.user),
		read: ({ req }) => isAdmin(req.user),
		update: ({ req }) => isAdmin(req.user),
	},
	fields: [],
};
