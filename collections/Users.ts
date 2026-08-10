import { type CollectionConfig, Forbidden } from "payload";

import { isAdmin, isAppUser } from "./access.ts";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "email",
	},
	auth: {
		cookies: {
			sameSite: "Lax",
			secure: process.env.NODE_ENV === "production",
		},
		removeTokenFromResponses: true,
		useSessions: false,
	},
	access: {
		admin: () => false,
		create: ({ req }) => isAdmin(req.user),
		delete: ({ req }) => isAdmin(req.user),
		read: ({ req }) => {
			if (isAdmin(req.user)) {
				return true;
			}

			if (!isAppUser(req.user)) {
				return false;
			}

			return {
				id: {
					equals: req.user.id,
				},
			};
		},
		update: ({ req }) => isAdmin(req.user),
	},
	fields: [],
	hooks: {
		beforeChange: [
			({ operation, req }) => {
				if (operation !== "create" || isAdmin(req.user)) {
					return;
				}

				throw new Forbidden(req.t);
			},
		],
	},
};
