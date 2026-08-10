"use client";

import { LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { useSessionQuery } from "../api/use-session-query";
import { SignInForm } from "./sign-in-form";

export function AuthGate({ children }: PropsWithChildren) {
	const sessionQuery = useSessionQuery();

	if (sessionQuery.isPending) {
		return (
			<AuthScreen>
				<div
					aria-live="polite"
					className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground"
				>
					<LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
					Restoring your session...
				</div>
			</AuthScreen>
		);
	}

	if (sessionQuery.isError) {
		return (
			<AuthScreen>
				<div className="space-y-4 text-center">
					<p className="text-sm text-red-200" role="alert">
						We could not check your session. Try again.
					</p>
					<button
						className="mx-auto flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
						onClick={() => sessionQuery.refetch()}
						type="button"
					>
						<RefreshCw aria-hidden="true" className="size-4" />
						Try again
					</button>
				</div>
			</AuthScreen>
		);
	}

	if (!sessionQuery.data.user) {
		return (
			<AuthScreen>
				<SignInForm />
			</AuthScreen>
		);
	}

	return children;
}

function AuthScreen({ children }: { children: ReactNode }) {
	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-20"
			/>
			<section className="glass-card relative w-full max-w-md rounded-2xl p-6 sm:p-8">
				<header className="mb-8 text-center">
					<div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg">
						<ShieldCheck
							aria-hidden="true"
							className="size-6 text-violet-400"
						/>
					</div>
					<h1 className="bg-linear-to-br from-white via-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
						TaskMaster
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Sign in to access your private task list.
					</p>
				</header>
				{children}
			</section>
		</main>
	);
}
