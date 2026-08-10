export function TodoVersionBadge() {
	return (
		<div className="mt-6 text-center space-y-2">
			<div className="inline-flex gap-2 text-[10px] text-muted-foreground font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">
				<span>v3.0.0-beta</span>
				<span className="text-white/20">|</span>
				<span>Turbo-Pack</span>
				<span className="text-white/20">|</span>
				<span className="text-green-400">Online</span>
			</div>
		</div>
	);
}
