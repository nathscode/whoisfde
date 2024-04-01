"use client";
import React, { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookingSchema, BookingSchemaInfer } from "@/lib/validators/booking";
import {
	Form,
	FormControl,
	FormDescription,
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Input } from "@/components/ui/input";
import BackButton from "../common/BackButton";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import LoadingButton from "../common/LoadingButton";

type Props = {};

const BookingForm = (props: Props) => {
	const datetimeRef = useRef(null);

	const form = useForm<BookingSchemaInfer>({
		resolver: zodResolver(BookingSchema),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			typeOfEvent: "",
		},
	});

	function onSubmit(values: BookingSchemaInfer) {
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
																field.onChange(value.toDate());
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
								<LoadingButton
									variant={"default"}
									type="submit"
									loading={false}
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
