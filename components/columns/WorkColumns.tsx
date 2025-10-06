"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";
import { SafeWork } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import DoomCheck from "../common/DoomCheck";
import DeleteButton from "../common/WorkDeleteButton";
import EditWorkModal from "../modals/EditWorkModal";

export const WorkColumns: ColumnDef<SafeWork>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => <span>{row.index + 1}</span>,
	},
	{
		accessorKey: "caption",
		header: "Caption",
		cell: ({ row }) => row.original.caption,
	},
	{
		accessorKey: "workType",
		header: "Type",
		cell: ({ row }) => row.original.workType,
	},
	{
		accessorKey: "date",
		header: "Created on",
		cell: ({ row }) => formatDateTime(row.original.createdAt),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const [isEditModalOpen, setIsEditModalOpen] = useState(false);
			const [showDeleteDialog, setShowDeleteDialog] = useState(false);

			return (
				<div className="flex items-center space-x-2">
					<DoomCheck
						id={row.original.id}
						initialChecked={row.original.isScrolled}
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setShowDeleteDialog(true)}
								className="text-red-600"
							>
								<Trash className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<EditWorkModal
						work={row.original}
						isOpen={isEditModalOpen}
						onClose={() => setIsEditModalOpen(false)}
					/>

					{showDeleteDialog && (
						<DeleteButton
							id={row.original.id}
							onCancel={() => setShowDeleteDialog(false)}
						/>
					)}
				</div>
			);
		},
	},
];
