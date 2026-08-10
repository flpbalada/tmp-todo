import { Loader2 } from "lucide-react";

export function TodoListLoading() {
	return (
		<div
			role="status"
			className="flex flex-col items-center justify-center h-full space-y-4 py-12 text-muted-foreground/50"
		>
			<Loader2
				aria-hidden="true"
				className="w-8 h-8 animate-spin text-primary"
			/>
			<p className="text-xs font-medium uppercase tracking-widest">
				Loading Tasks...
			</p>
		</div>
	);
}
