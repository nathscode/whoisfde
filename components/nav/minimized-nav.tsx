"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

import { easings } from "@/components/util/animations";
import NavMenuItem from "./NavMenuItem";
import Link from "next/link";
import Image from "next/image";
import NavMenuToggle from "./NavMenuToggle";

const NavMenu = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const navItems: { href: string; title: string }[] = [
		{ href: "/reviews", title: "Reviews" },
		{ href: "/pricing", title: "Pricing" },
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
							/>
						))}
					</motion.ul>
				</motion.nav>
			)}
		</>
	);
};

export default NavMenu;
