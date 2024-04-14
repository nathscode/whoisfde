"use client";

import { formatDateTime } from "@/lib/utils";
import { SafeRequest } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const RequestColumns: ColumnDef<SafeRequest>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => <span>{row.index + 1}</span>,
	},
	{
		accessorKey: "Name",
		header: "Name",
		cell: ({ row }) => row.original.name,
	},
	{
		accessorKey: "Email",
		header: "Email",
		cell: ({ row }) => row.original.email,
	},
	{
		accessorKey: "Date",
		header: "Date",
		cell: ({ row }) => formatDateTime(row.original.createdAt!.toString()!),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<Link
				href={`/dashboard/requests/${row.original.id}`}
				className="hover:underline"
			>
				View
			</Link>
		),
	},
];
