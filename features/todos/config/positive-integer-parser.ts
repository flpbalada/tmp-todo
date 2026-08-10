import { createParser } from "nuqs";

export const positiveIntegerParser = createParser({
	parse: (value) => {
		const integer = Number(value);
		return Number.isInteger(integer) && integer > 0 ? integer : null;
	},
	serialize: String,
});
