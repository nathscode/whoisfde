"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useSheetStore from "../store/sheet-store";
import { Button } from "../ui/button";

const TopBar = () => {
	const pathname = usePathname();
	const isOpen = useSheetStore((state) => state.isOpen);
	const onClose = useSheetStore((state) => state.onClose);
	const onOpen = useSheetStore((state) => state.onOpen);

	const openChangeWrapper = () => {
		onOpen();
	};

	useEffect(() => {
		if (isOpen) {
			onClose();
		}
	}, [pathname]);

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

			<Sheet open={isOpen} onOpenChange={openChangeWrapper}>
				<SheetTrigger>
					<Menu className="cursor-pointer md:hidden" />
				</SheetTrigger>
				<SheetContent className="w-full sm:max-w-[350px]" side={"right"}>
					<SheetHeader>
						<div className="flex flex-col">
							<div className="flex flex-col justify-center items-center w-full">
								<Image
									src={"/images/site_summary.png"}
									alt="logo"
									width={100}
									height={100}
								/>
							</div>
							<div className="flex flex-col gap-12">
								{navLinks.map((link) => (
									<Link
										href={link.url}
										key={link.label}
										passHref
										className={`flex gap-4 font-medium px-2 ${
											pathname === link.url
												? "border-l-2 border-slate-600"
												: "text-grey-800"
										}`}
									>
										{link.icon} <p>{link.label}</p>
									</Link>
								))}
								<Button
									onClick={() => signOut({ callbackUrl: "/" })}
									type="button"
								>
									Log out
								</Button>
							</div>
						</div>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default TopBar;
