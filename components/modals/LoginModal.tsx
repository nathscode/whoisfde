"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import useMount from "@/hooks/use-mount";
import { LoginSchema, LoginSchemaInfer } from "@/lib/validators/login";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingButton from "../common/LoadingButton";
import { useToast } from "../ui/use-toast";
import RequestModal from "./RequestModal";

type Props = {};

const LoginModal = (props: Props) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const isMounted = useMount();
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { mutate: LoginFunc, isPending } = useMutation({
		mutationFn: async ({ email, password }: LoginSchemaInfer) => {
			const { data } = await axios.post("/api/auth/login", {
				email,
				password,
			});
			return data;
		},
	});

	const onSubmit = async (values: LoginSchemaInfer) => {
		LoginFunc(
			{
				email: values.email.toLowerCase(),
				password: values.password,
			},
			{
				onSuccess: (data) => {
					if (data.status == 200) {
						signIn("credentials", {
							email: values.email.toLowerCase(),
							password: values.password,
							callbackUrl: "/",
							redirect: true,
						});
					}
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
					Login
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Login as OG&apos;s
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						If you don't have OG&apos;s Login details, click this button to join{" "}
						<RequestModal />
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
							<div className="flex flex-col justify-end text-right w-full my-5">
								<Link
									href={"auth/account/forget-password"}
									className="text-sm hover:underline"
								>
									Forget Password
								</Link>
							</div>
							<LoadingButton
								type="submit"
								loading={isPending}
								className="mt-6 w-full"
							>
								Login
							</LoadingButton>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LoginModal;
