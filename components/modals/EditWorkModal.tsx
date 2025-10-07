"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SafeWork } from "@/types";
import { useToast } from "../ui/use-toast";
import { updateWork } from "@/actions/updateWork";

const workSchema = z.object({
	caption: z.string().min(1, "Caption is required").max(5000),
	workType: z.string().min(1, "Work type is required"),
});

type WorkFormValues = z.infer<typeof workSchema>;

interface EditWorkModalProps {
	work: SafeWork;
	isOpen: boolean;
	onClose: () => void;
}

export default function EditWorkModal({
	work,
	isOpen,
	onClose,
}: EditWorkModalProps) {
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	const form = useForm<WorkFormValues>({
		resolver: zodResolver(workSchema),
		defaultValues: {
			caption: work.caption || "",
			workType: work.workType || "",
		},
	});

	const onSubmit = (values: WorkFormValues) => {
		startTransition(async () => {
			try {
				const result = await updateWork(work.id, values);

				if (result.success) {
					toast({ description: "Work updated successfully" });
					onClose();
					form.reset();
				} else {
					toast({
						description: `${result.error || "Failed to update work"}`,
						variant: "destructive",
					});
				}
			} catch (error) {
				toast({
					description: "An error occurred while updating",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Edit Work</DialogTitle>
					<DialogDescription>
						Update the caption and work type for this item.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="workType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Work Type</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select work type" />
											</SelectTrigger>
											<SelectContent>
												<ScrollArea className="h-[150px] w-full">
													{[
														"Brands",
														"Events",
														"Personal",
														"Estate",
														"Stills",
														"Weddings",
													].map((type, index) => (
														<SelectItem
															className="capitalize"
															key={index}
															value={type}
														>
															{type}
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
							name="caption"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Caption</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter caption"
											className="resize-none"
											disabled={isPending}
											rows={4}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Updating..." : "Update"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
