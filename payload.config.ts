import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import { Admins } from "./collections/Admins.ts";
import { Todos } from "./collections/Todos.ts";
import { Users } from "./collections/Users.ts";

const databaseUrl = process.env.DATABASE_URL;
const payloadSecret = process.env.PAYLOAD_SECRET;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is required");
}

if (!payloadSecret) {
	throw new Error("PAYLOAD_SECRET is required");
}

export default buildConfig({
	admin: {
		user: "admins",
	},
	collections: [Admins, Users, Todos],
	db: postgresAdapter({
		idType: "uuid",
		pool: {
			connectionString: databaseUrl,
		},
		push: false,
	}),
	secret: payloadSecret,
});
