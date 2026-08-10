import type { Todo } from "../types/todo";

export function getTodoId(input: unknown): Todo["id"] | null {
	if (typeof input !== "object" || input === null || !("id" in input)) {
		return null;
	}
	return typeof input.id === "string" ? input.id : null;
}
