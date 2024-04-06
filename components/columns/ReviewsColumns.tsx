"use client";

import { formatDateTime } from "@/lib/utils";
import { SafeReview } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const ReviewsColumns: ColumnDef<SafeReview>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => <span>{row.index + 1}</span>,
	},
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => row.original.id,
	},
	{
		accessorKey: "content",
		header: "Content",
		cell: ({ row }) => row.original.content,
	},
	{
		accessorKey: "Created",
		header: "Date",
		cell: ({ row }) => formatDateTime(row.original.createdAt!.toString()!),
	},
	{
		id: "actions",
		cell: ({ row }) => <span>View</span>,
	},
];
