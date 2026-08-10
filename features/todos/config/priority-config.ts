import type { Priority } from "../types/priority";

export const priorityConfig: Record<
	Priority,
	{ label: string; color: string; bg: string }
> = {
	low: { label: "Low", color: "text-slate-400", bg: "bg-slate-400/10" },
	medium: {
		label: "Medium",
		color: "text-yellow-400",
		bg: "bg-yellow-400/10",
	},
	high: { label: "High", color: "text-red-400", bg: "bg-red-400/10" },
};
