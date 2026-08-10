"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateTodoMutation } from "../api/use-create-todo-mutation";
import { createTodoInputSchema } from "../schemas/create-todo-input-schema";
import type { CreateTodoInput } from "../types/create-todo-input";
import type { TodoFormProps } from "../types/todo-form-props";

export function TodoForm({ categories, onClose }: TodoFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateTodoInput>({
		resolver: zodResolver(createTodoInputSchema),
		defaultValues: {
			text: "",
			priority: "medium",
			category: "other",
			dueDate: undefined,
		},
	});
	const createMutation = useCreateTodoMutation();
	const submitTodo = (input: CreateTodoInput) => {
		createMutation.reset();
		createMutation.mutate(input, {
			onSuccess: () => {
				reset();
				onClose();
			},
			onError: (error) => {
				console.error(error);
				// TODO: Display a toast notification when shared notifications are available.
			},
		});
	};

	return (
		<form
			onSubmit={handleSubmit(submitTodo)}
			className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
		>
			<label className="sr-only" htmlFor="todo-text">
				Task description
			</label>
			<input
				id="todo-text"
				type="text"
				{...register("text")}
				aria-invalid={errors.text ? true : undefined}
				aria-describedby={errors.text ? "todo-text-error" : undefined}
				placeholder="What needs to be done?"
				className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
			/>
			{errors.text?.message && (
				<p id="todo-text-error" role="alert" className="text-xs text-red-300">
					{errors.text.message}
				</p>
			)}
			<div className="flex flex-wrap gap-2">
				<label className="sr-only" htmlFor="todo-category">
					Category
				</label>
				<select
					id="todo-category"
					{...register("category")}
					aria-invalid={errors.category ? true : undefined}
					className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
				>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.label}
						</option>
					))}
				</select>
				<label className="sr-only" htmlFor="todo-priority">
					Priority
				</label>
				<select
					id="todo-priority"
					{...register("priority")}
					aria-invalid={errors.priority ? true : undefined}
					className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
				>
					<option value="low">Low Priority</option>
					<option value="medium">Medium Priority</option>
					<option value="high">High Priority</option>
				</select>
				<label className="sr-only" htmlFor="todo-due-date">
					Due date
				</label>
				<input
					id="todo-due-date"
					type="date"
					{...register("dueDate", {
						setValueAs: (value) => value || undefined,
					})}
					aria-invalid={errors.dueDate ? true : undefined}
					className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50"
				/>
			</div>
			{(errors.category?.message ||
				errors.priority?.message ||
				errors.dueDate?.message) && (
				<p role="alert" className="text-xs text-red-300">
					{errors.category?.message ||
						errors.priority?.message ||
						errors.dueDate?.message}
				</p>
			)}
			{createMutation.isError && (
				<p role="alert" className="text-xs text-red-300">
					Unable to create task. Try again.
				</p>
			)}
			<div className="flex gap-2">
				<button
					type="submit"
					disabled={createMutation.isPending}
					className="flex-1 bg-violet-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-violet-500 disabled:opacity-50 transition-all"
				>
					{createMutation.isPending ? "Adding..." : "Add Task"}
				</button>
				<button
					type="button"
					onClick={onClose}
					disabled={createMutation.isPending}
					className="px-4 py-2 rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5 transition-all text-sm disabled:opacity-50"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}
