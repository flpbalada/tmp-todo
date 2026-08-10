import { Suspense } from "react";
import { AuthGate } from "@/features/auth";
import { TodoPage } from "@/features/todos";

export default function Home() {
	return (
		<Suspense>
			<AuthGate>
				<TodoPage />
			</AuthGate>
		</Suspense>
	);
}
