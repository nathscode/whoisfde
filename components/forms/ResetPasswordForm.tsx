"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import {
	ResetPasswordSchema,
	ResetPasswordSchemaInfer,
} from "@/lib/validators/reset-password";

type Props = {
	token: string;
};
const ResetPasswordForm = ({ token }: Props) => {
	const router = useRouter();
	const { toast } = useToast();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const form = useForm<ResetPasswordSchemaInfer>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
			token: token,
		},
	});

	const { mutate: ResetPasswordFunc, isPending } = useMutation({
		mutationFn: async ({
			password,
			confirmPassword,
			token,
		}: ResetPasswordSchemaInfer) => {
			const { data } = await axios.post("/api/auth/password/complete", {
				password,
				confirmPassword,
				token,
			});
			return data;
		},
	});

	function onSubmit(values: ResetPasswordSchemaInfer) {
		ResetPasswordFunc(
			{
				password: values.password,
				confirmPassword: values.confirmPassword,
			},
			{
				onSuccess: () => {
					router.push("/login");
					toast({
						title: "Password Reset Successfully",
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
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	return (
		<div className="flex justify-start flex-col w-full">
			<div className="flex justify-start gap-y-4 flex-col md:flex-row w-full">
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
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														type={showPassword ? "text" : "password"}
														placeholder="Enter your password"
														disabled={form.formState.isSubmitting}
														{...field}
													/>
												</FormControl>
												<span className="absolute top-[10px] right-3">
													<button
														type="button"
														onClick={togglePasswordVisibility}
													>
														{showPassword ? (
															<Eye className="h-5 w-5" />
														) : (
															<EyeOff className="w-5 h-5" />
														)}{" "}
													</button>
												</span>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm password</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														type={showPassword ? "text" : "password"}
														placeholder="Confirm password"
														disabled={form.formState.isSubmitting}
														{...field}
													/>
												</FormControl>
												<span className="absolute top-[10px] right-3">
													<button
														type="button"
														onClick={togglePasswordVisibility}
													>
														{showPassword ? (
															<Eye className="h-5 w-5" />
														) : (
															<EyeOff className="w-5 h-5" />
														)}{" "}
													</button>
												</span>
											</div>
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
								Reset Password{" "}
								{isPending ? (
									<Loader2 className="ml-2 h-4 w-4 animate-spin" />
								) : null}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordForm;
