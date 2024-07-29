"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import {
	ResetPasswordEmailSchema,
	ResetPasswordEmailSchemaInfer,
} from "@/lib/validators/reset-password";

const ResetPasswordEmailForm = () => {
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<ResetPasswordEmailSchemaInfer>({
		resolver: zodResolver(ResetPasswordEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const { mutate: ResetPasswordEmailFunc, isPending } = useMutation({
		mutationFn: async ({ email }: ResetPasswordEmailSchemaInfer) => {
			const { data } = await axios.post("/api/auth/password/reset", {
				email,
			});
			return data;
		},
	});

	function onSubmit(values: ResetPasswordEmailSchemaInfer) {
		ResetPasswordEmailFunc(
			{
				email: values.email,
			},
			{
				onSuccess: () => {
					router.push("/login");
					toast({
						title: "Reset Email Sent Successfully",
					});
				},
				onError: (err: any) => {
					if (err instanceof AxiosError) {
						if (err.response?.data?.status === 400) {
							return toast({
								title: "An error occurred.",
								description: `${err.response?.data?.errors?.message}`,
								variant: "destructive",
							});
						}
						if (err.response?.data?.status === 401) {
							return toast({
								title: "Unverified account",
								description: `${err.response?.data?.errors?.message}`,
								variant: "destructive",
							});
						}

						if (err.response?.data?.status === 404) {
							return toast({
								title: "Invalid credentials.",
								description: `${err.response.data?.errors?.message}`,
								variant: "destructive",
							});
						}
						toast({
							title: "There was an error",
							description: "Server error",
							variant: "destructive",
						});
					}
				},
			}
		);
		form.reset();
	}
	return (
		<div className="flex justify-center flex-col w-full">
			<div className="flex justify-center gap-y-4 flex-col md:flex-row w-full">
				<div className="flex flex-col flex-1 shadow-sm rounded-lg px-5 py-8 border bg-white w-full">
					<h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-2xl">
						Reset Password
					</h2>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="w-full mt-4"
						>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													disabled={form.formState.isSubmitting}
													placeholder="mail@example.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Button
								className="w-full mt-6"
								type="submit"
								disabled={isPending ? true : false}
							>
								Send Password Reset Link
								{isPending ? (
									<Loader2 className="ml-2 h-4 w-4 animate-spin" />
								) : null}
							</Button>
						</form>
						<div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
							or
						</div>

						<p className="text-center text-sm text-gray-600 mt-2">
							Go back
							<Link className="text-brand hover:underline ml-2" href="/login">
								Log in
							</Link>
						</p>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordEmailForm;
