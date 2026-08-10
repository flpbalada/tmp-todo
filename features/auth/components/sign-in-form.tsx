"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSignInMutation } from "../api/use-sign-in-mutation";
import { signInInputSchema } from "../schemas/sign-in-input-schema";
import type { SignInInput } from "../types/sign-in-input";

export function SignInForm() {
	const signInMutation = useSignInMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInInput>({
		resolver: zodResolver(signInInputSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const submitCredentials = (input: SignInInput) => {
		signInMutation.reset();
		signInMutation.mutate(input);
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit(submitCredentials)}>
			<div className="space-y-2">
				<label className="text-sm font-medium text-white/90" htmlFor="email">
					Email
				</label>
				<input
					{...register("email")}
					aria-describedby={errors.email ? "email-error" : undefined}
					aria-invalid={errors.email ? true : undefined}
					autoComplete="email"
					className="glass-input w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-2"
					id="email"
					placeholder="you@company.com"
					type="email"
				/>
				{errors.email?.message && (
					<p className="text-xs text-red-300" id="email-error" role="alert">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium text-white/90" htmlFor="password">
					Password
				</label>
				<input
					{...register("password")}
					aria-describedby={errors.password ? "password-error" : undefined}
					aria-invalid={errors.password ? true : undefined}
					autoComplete="current-password"
					className="glass-input w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-2"
					id="password"
					placeholder="Enter your password"
					type="password"
				/>
				{errors.password?.message && (
					<p className="text-xs text-red-300" id="password-error" role="alert">
						{errors.password.message}
					</p>
				)}
			</div>

			{signInMutation.isError && (
				<p
					className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200"
					role="alert"
				>
					Invalid email or password.
				</p>
			)}

			<button
				className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={signInMutation.isPending}
				type="submit"
			>
				<LogIn aria-hidden="true" className="size-4" />
				{signInMutation.isPending ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
}
