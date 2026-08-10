import { AlertCircle } from "lucide-react";

export function TodoListError() {
	return (
		<div
			role="alert"
			className="text-center py-12 border border-red-500/30 rounded-xl bg-red-500/10"
		>
			<AlertCircle
				aria-hidden="true"
				className="w-6 h-6 mx-auto mb-3 text-red-400"
			/>
			<p className="text-sm text-red-200">
				Unable to load tasks. Please try again.
			</p>
		</div>
	);
}
