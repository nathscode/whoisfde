"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constants";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const LeftSideBar = () => {
	const pathname = usePathname();
	return (
		<div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
			<Image
				src={"/images/site_summary.png"}
				alt="logo"
				width={150}
				height={70}
			/>

			<div className="flex flex-col gap-12">
				{navLinks.map((link) => (
					<Link
						href={link.url}
						key={link.label}
						className={`flex gap-4 font-medium px-2 ${
							pathname === link.url
								? "border-l-2 border-slate-600"
								: "text-grey-800"
						}`}
					>
						{link.icon} <p>{link.label}</p>
					</Link>
				))}
				<Button onClick={() => signOut({ callbackUrl: "/" })} type="button">
					Log out
				</Button>
			</div>
		</div>
	);
};

export default LeftSideBar;
