import { sessionSchema } from "../schemas/session-schema";
import type { Session } from "../types/session";
import type { SignInInput } from "../types/sign-in-input";

export async function getSession(): Promise<Session> {
	const response = await fetch("/api/users/me", {
		credentials: "include",
	});

	if (response.status === 401 || response.status === 403) {
		return { user: null };
	}

	if (!response.ok) {
		throw new Error("Unable to restore the session");
	}

	return parseSessionResponse(response);
}

export async function signIn(input: SignInInput): Promise<Session> {
	const response = await fetch("/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		throw new Error("Invalid email or password");
	}

	return parseSessionResponse(response);
}

async function parseSessionResponse(response: Response): Promise<Session> {
	const result = sessionSchema.safeParse(await response.json());

	if (!result.success) {
		throw new Error("Payload returned an invalid authentication response");
	}

	return result.data;
}
