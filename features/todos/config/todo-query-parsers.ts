import { parseAsString, parseAsStringLiteral } from "nuqs";
import { categoryFilterSchema } from "../schemas/category-filter-schema";
import { priorityFilterSchema } from "../schemas/priority-filter-schema";
import { statusFilterSchema } from "../schemas/status-filter-schema";
import { positiveIntegerParser } from "./positive-integer-parser";

export const todoQueryParsers = {
	q: parseAsString.withDefault(""),
	category: parseAsStringLiteral(categoryFilterSchema.options).withDefault(
		"all",
	),
	priority: parseAsStringLiteral(priorityFilterSchema.options).withDefault(
		"all",
	),
	status: parseAsStringLiteral(statusFilterSchema.options).withDefault("all"),
	page: positiveIntegerParser.withDefault(1),
};
