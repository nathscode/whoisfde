"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { SafeWork } from "@/types";
import { useToast } from "../ui/use-toast";

interface DoomCheckProps {
	id: string;
	initialChecked: boolean;
}

// API function to toggle isScrolled
async function toggleIsScrolled(
	id: string,
	isScrolled: boolean
): Promise<SafeWork> {
	const response = await fetch(`/api/rooter/work/${id}/toggle-scrolled`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ isScrolled }),
	});

	if (!response.ok) {
		throw new Error("Failed to update work status");
	}

	return response.json();
}

const DoomCheck = ({ id, initialChecked }: DoomCheckProps) => {
	const [isChecked, setIsChecked] = useState(initialChecked);
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const mutation = useMutation({
		mutationFn: (newCheckedState: boolean) =>
			toggleIsScrolled(id, newCheckedState),

		// Optimistic update
		onMutate: async (newCheckedState: boolean) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["works"] });

			// Snapshot the previous value
			const previousWorks = queryClient.getQueryData(["works"]);

			// Optimistically update the UI
			setIsChecked(newCheckedState);

			// Optimistically update the cache if you're using react-query for data fetching
			queryClient.setQueryData(["works"], (old: SafeWork[] | undefined) => {
				if (!old) return old;
				return old.map((work) =>
					work.id === id ? { ...work, isScrolled: newCheckedState } : work
				);
			});

			// Return a context object with the snapshotted value
			return { previousWorks, newCheckedState };
		},

		// If the mutation succeeds, we don't need to do anything
		// as the optimistic update already updated the UI
		onSuccess: (data, variables) => {
			toast({
				description: "Status updated successfully",
			});

			// Invalidate queries to ensure fresh data
			queryClient.invalidateQueries({ queryKey: ["works"] });
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (error, variables, context) => {
			// Roll back optimistic update
			if (context?.previousWorks) {
				queryClient.setQueryData(["works"], context.previousWorks);
			}

			// Roll back local state
			setIsChecked(!context?.newCheckedState);

			// Show error message
			toast({
				description: "Failed to update status. Please try again",
			});

			console.error("Error toggling work status:", error);
		},

		// Always refetch after error or success to ensure consistency
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["works"] });
		},
	});

	const handleCheckedChange = (checked: boolean) => {
		mutation.mutate(checked);
	};

	return (
		<div className="flex items-center space-x-2">
			<Checkbox
				id={`doom-check-${id}`}
				checked={isChecked}
				onCheckedChange={handleCheckedChange}
				disabled={mutation.isPending}
				className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
			/>
			<label
				htmlFor={`doom-check-${id}`}
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
			>
				{mutation.isPending
					? "Updating..."
					: isChecked
					? "Scrolled"
					: "Not Scrolled"}
			</label>
		</div>
	);
};

export default DoomCheck;
