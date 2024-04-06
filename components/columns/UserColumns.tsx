"use client";

import { CustomUser } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const UserColumns: ColumnDef<CustomUser>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => <span>{row.index + 1}</span>,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => row.original.name,
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => row.original.email,
	},
	{
		accessorKey: "phone",
		header: "phone",
		cell: ({ row }) => row.original.phone,
	},
	{
		id: "actions",
		cell: ({ row }) => <span>View</span>,
	},
];
