"use client";

import axios, { AxiosError } from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useMount from "@/hooks/use-mount";
import { useToast } from "../ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import LoadingButton from "../common/LoadingButton";
import { UserSchema, UserSchemaInfer } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";

type Props = {};

const RegisterModal = (props: Props) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const isMounted = useMount();
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			name,
			email,
			password,
			confirmPassword,
		}: UserSchemaInfer) => {
			const payload: UserSchemaInfer = {
				name,
				email,
				password,
				confirmPassword,
			};
			const { data } = await axios.post("/api/auth/register", payload);
			return data;
		},
		onSuccess: () => {
			window.location.reload();
			form.reset();
			return toast({
				description: "Account created successfully, verify your account",
			});
		},
		onError: (err: any) => {
			if (err instanceof AxiosError) {
				if (err.response?.data?.status === 409) {
					return toast({
						title: "An error occurred.",
						description: `${err.response?.data?.errors?.message}`,
						variant: "destructive",
					});
				}

				if (err.response?.status === 422) {
					return toast({
						title: "Invalid credentials.",
						description: `${err.response.data?.errors?.message}`,
						variant: "destructive",
					});
				}
				toast({
					title: "There was an error",
					description: "Could not create user, check your network connections",
					variant: "destructive",
				});
			}
		},
	});

	const onSubmit = async (values: UserSchemaInfer) => {
		mutate(values);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	if (!isMounted) {
		return null;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default" size="lg" disabled={false}>
					Create User
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Create OG&apos;s
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Make sure you provide the accurate document.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-start flex-col  w-full justify-start p-5">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4  w-full"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Full name
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter Your Full name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Email
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter Email address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
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
							<LoadingButton
								type="submit"
								loading={isPending}
								className="mt-6 w-full"
							>
								Submit
							</LoadingButton>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default RegisterModal;
