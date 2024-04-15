"use client";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BookingSchema, BookingSchemaInfer } from "@/lib/validators/booking";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useForm } from "react-hook-form";
import BackButton from "../common/BackButton";
import LoadingButton from "../common/LoadingButton";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

type Props = {};

const BookingForm = (props: Props) => {
	const router = useRouter();
	const { toast } = useToast();
	const searchParam = useSearchParams();
	const type = searchParam.get("type");
	const datetimeRef = useRef(null);

	const form = useForm<BookingSchemaInfer>({
		resolver: zodResolver(BookingSchema),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			typeOfEvent: "",
			note: "",
			bookType: type ? type : "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			name,
			phone,
			email,
			typeOfEvent,
			note,
			bookType,
			date,
		}: BookingSchemaInfer) => {
			const payload: BookingSchemaInfer = {
				name,
				phone,
				email,
				typeOfEvent,
				note,
				bookType,
				date,
			};
			const { data } = await axios.post("/api/booking", payload);
			return data;
		},
		onSuccess: (data) => {
			window.location.reload();
			form.reset();
			return toast({
				description: "Booking created successfully",
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

	function onSubmit(values: BookingSchemaInfer) {
		mutate(values);
		console.log(values);
	}
	return (
		<div className="container">
			<div className="flex justify-start flex-col w-full">
				<div className="flex justify-start gap-y-4 flex-col md:flex-row w-full">
					<div className="flex flex-col flex-1 shadow-sm rounded-lg px-5 py-8 border bg-white w-full">
						<div className="flex justify-between flex-wrap my-5">
							<BackButton />
						</div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={isPending}
													placeholder="Enter Full name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={isPending}
													placeholder="Enter Phone number"
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
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													disabled={isPending}
													type="email"
													placeholder="Enter your email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="typeOfEvent"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Event Type</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
													disabled={isPending}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Category" />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-[150px] w-full">
															{[
																"Concert",
																"Contents",
																"Parties",
																"Photography",
																"Weddings",
															].map((event, index) => (
																<SelectItem
																	className="capitalize"
																	key={index}
																	value={event}
																>
																	{event}
																</SelectItem>
															))}
														</ScrollArea>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="date"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Inspection Date</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value ? (
																`${field.value.toDateString()} ${field.value.toLocaleTimeString()}`
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Datetime
														ref={datetimeRef}
														value={field.value}
														onChange={(value) => {
															if (moment.isMoment(value)) {
																const formattedDate = value.format(
																	"ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]"
																);
																field.onChange(
																	moment(
																		formattedDate,
																		"ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]"
																	).toDate()
																);
															}
														}}
													/>
												</PopoverContent>
											</Popover>
											<FormDescription>
												Your about to set the event date for your booking.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="note"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Note</FormLabel>
											<FormControl>
												<Textarea
													disabled={isPending}
													className=" rounded-none"
													placeholder="Have anything in mind to say..."
													id="note"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<LoadingButton
									variant={"default"}
									type="submit"
									loading={isPending}
									className="mt-6 w-full"
								>
									Submit
								</LoadingButton>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingForm;
