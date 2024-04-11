"use client";

import { formatDateTime } from "@/lib/utils";
import { SafeBooking } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const BookingColumns: ColumnDef<SafeBooking>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => <span>{row.index + 1}</span>,
	},
	{
		accessorKey: "bookingNumber",
		header: "Booking Number",
		cell: ({ row }) => (
			<Link
				href={`/dashboard/bookings/${row.original.id}`}
				className="hover:text-brand"
			>
				{row.original.bookingNumber}
			</Link>
		),
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
		cell: ({ row }) => formatDateTime(row.original.date!.toString()!),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<Link href={`/dashboard/bookings/${row.original.id}`}>View</Link>
		),
	},
];
