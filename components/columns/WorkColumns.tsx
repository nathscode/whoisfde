"use client";

import { formatDateTime } from "@/lib/utils";
import { SafeWork } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import DeleteButton from "../common/WorkDeleteButton";
import DoomCheck from "../common/DoomCheck";

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
		cell: ({ row }) => (
			<div className="flex items-center space-x-2">
				<DoomCheck
					id={row.original.id}
					initialChecked={row.original.isScrolled}
				/>
				<DeleteButton id={row.original.id} />
			</div>
		),
	},
];
