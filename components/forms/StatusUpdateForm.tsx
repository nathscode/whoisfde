"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

import {
	Dialog,
	DialogContent,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	statusUpdateSchema,
	statusUpdateSchemaInfer,
} from "@/lib/validators/status";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import LoadingButton from "../common/LoadingButton";
import { useToast } from "../ui/use-toast";
import { updateBookingStatus } from "@/actions/updateBookingStatus";

type Props = {
	bookingId: string;
};

const StatusUpdateForm = ({ bookingId }: Props) => {
	const [isLoading, startTransition] = useTransition();
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm<statusUpdateSchemaInfer>({
		resolver: zodResolver(statusUpdateSchema),
		defaultValues: {
			status: "",
			bookingId: bookingId,
		},
	});
	function onSubmit(values: statusUpdateSchemaInfer) {
		startTransition(async () => {
			const result = await updateBookingStatus(values);
			router.refresh();
			toast({ title: `${result.message}` });
			window.location.reload();
		});
		form.reset();
	}
	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant={"default"}
						size="lg"
						className="text-white"
						disabled={false}
					>
						<span className="inline-flex items-center text-brand">
							<span className="text-sm ">Update Status</span>
						</span>
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Your about to make update on this booking</DialogTitle>
					</DialogHeader>
					<div className="flex items-start flex-col  w-full justify-start">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 w-full"
							>
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status </FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Status" />
													</SelectTrigger>
													<SelectContent>
														{Object.values(BookingStatus).map((type) => (
															<SelectItem
																key={type}
																value={type}
																className="capitalize"
															>
																{type.toLowerCase()}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<LoadingButton
									variant={"default"}
									type="submit"
									loading={isLoading}
									className="mt-6 w-full"
								>
									Submit
								</LoadingButton>
							</form>
						</Form>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default StatusUpdateForm;
