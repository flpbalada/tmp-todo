import type { QueryKey } from "@tanstack/react-query";
import type { TodoListData } from "./todo-list-data";

export interface TodoListSnapshot {
	queryKey: QueryKey;
	before: TodoListData;
	after: TodoListData;
}

export type TodoListSnapshots = TodoListSnapshot[];
