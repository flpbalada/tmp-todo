import type { Todo } from "./todo";

export interface ItemError {
	id: Todo["id"];
	message: string;
}
