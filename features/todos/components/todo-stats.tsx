import type { TodoStatsProps } from "../types/todo-stats-props";

export function TodoStats({ stats }: TodoStatsProps) {
	return (
		<div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
			<div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
				<div className="text-2xl font-bold text-white">{stats.total}</div>
				<div className="text-xs text-muted-foreground">Total</div>
			</div>
			<div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
				<div className="text-2xl font-bold text-blue-400">{stats.active}</div>
				<div className="text-xs text-muted-foreground">Active</div>
			</div>
			<div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
				<div className="text-2xl font-bold text-green-400">
					{stats.completed}
				</div>
				<div className="text-xs text-muted-foreground">Done</div>
			</div>
			<div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
				<div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
				<div className="text-xs text-muted-foreground">Overdue</div>
			</div>
		</div>
	);
}
