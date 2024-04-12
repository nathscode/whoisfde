"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

import { arrowMotion, dividerMotion, easings, itemContentMotion, itemCoverMotion } from "@/components/util/animations";
import NavMenuItem from "./NavMenuItem";
import Link from "next/link";
import Image from "next/image";
import NavMenuToggle from "./NavMenuToggle";
import { CustomUser } from "@/types";
import { ArrowBigRight } from "lucide-react";
import { RoleType } from "@prisma/client";

type Props = {
	session?: CustomUser;
};


const NavMenu = ({session}: Props) => {
		const isAdmin = session?.role === RoleType.ADMIN ? true : false;

	const [menuOpen, setMenuOpen] = useState(false);

	const navItems: { href: string; title: string }[] = [
		{ href: "/", title: "Home" },
		{ href: "/reviews", title: "Reviews" },
		{ href: "/package", title: "Package" },
		{ href: "/contact", title: "Contact" },
	];

	return (
		<>
			<div className="relative flex justify-between w-full bg-black">
				<div className="justify-start">
					<Link
						href={"/"}
						className="inline-flex hover:cursor-pointer hover:opacity-50 active:opacity-50"
					>
						<Image
							src={"/images/logo/logo-white.png"}
							width={100}
							height={20}
							alt="logo"
						/>
					</Link>
				</div>
				<div className="justify-end relative top-10 right-5">
					<NavMenuToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
				</div>
			</div>
			{menuOpen && (
				<motion.nav
					className="absolute h-screen w-screen bg-black flex flex-col p-4 z-50"
					initial={{ y: "-100%" }}
					animate={{
						y: 0,
						transition: { duration: 0.1, ease: easings.easeOutQuart },
					}}
					exit={{ y: "-100%", transition: { duration: 0.1 } }}
				>
					<motion.ul exit={{ opacity: 0, transition: { duration: 0 } }}>
						{navItems.map((item, idx) => (
							<NavMenuItem
								key={idx}
								index={idx + 1}
								href={item.href}
								title={item.title}
								isAdmin={true}
							/>
						))}
						{isAdmin && (
						<motion.li
			className={`cursor-pointer py-4 relative w-full 
				 "pointer-events-auto"`}
               
		>
			<Link href={"/dashboard"} className="flex items-center relative w-full">
				<motion.div
					className="absolute left-0 top-0 right-0 bottom-0 bg-black"
					variants={itemCoverMotion}
				/>
				<motion.span
					className="w-[4ch] text-white text-lg"
					variants={itemContentMotion}
				>
					({"05"})
				</motion.span>
				<h1 className="uppercase text-white tracking-wide text-lg sm:text-5xl md:text-6xl flex-1">
					Dashboard
				</h1>
				<motion.div variants={arrowMotion}>
					<ArrowBigRight className="h-6 w-6 text-white" />
				</motion.div>
			</Link>
			<motion.div
				className="absolute bottom-0 h-[2px] bg-black w-full origin-left"
				variants={dividerMotion}
			/>
						</motion.li>

						)}
					</motion.ul>
				</motion.nav>
			)}
		</>
	);
};

export default NavMenu;
