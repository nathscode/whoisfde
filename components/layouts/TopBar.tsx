"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
	const pathname = usePathname();

	return (
		<div className="sticky top-0 z-50 w-full flex justify-between items-center px-8 py-4 bg-blue-2 shadow-xl lg:hidden">
			<Image
				src={"/images/site_summary.png"}
				alt="logo"
				width={80}
				height={50}
			/>

			<div className="flex gap-8 max-md:hidden">
				{navLinks.map((link) => (
					<Link
						href={link.url}
						key={link.label}
						className={`flex gap-4 text-body-medium ${
							pathname === link.url ? "text-blue-1" : "text-grey-1"
						}`}
					>
						<p>{link.label}</p>
					</Link>
				))}
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger>
					<Menu className="cursor-pointer md:hidden" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="max-w-sm">
					{navLinks.map((link, idx) => (
						<DropdownMenuItem key={idx} className="px-10 py-3 justify-start">
							<Link
								href={link.url}
								key={link.label}
								className="flex gap-4 text-body-medium"
							>
								{link.icon} <p>{link.label}</p>
							</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuItem>
						<Button onClick={() => signOut({ callbackUrl: "/" })} type="button">
							Log out
						</Button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default TopBar;
