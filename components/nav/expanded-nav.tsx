"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TransitionLink from "../TransitionLink";

export default function ExpandedNav() {
	return (
		<div
			style={{ transition: "all 0.35s linear" }}
			className={`fixed bg-black/50 top-0 text-white flex left-0 right-0 z-10 h-[61px] text-semibold text-lg`}
		>
			<div
				className="
        px-2
        lg:px-[150px] 
        xl:px-[250px] 
        flex 
        justify-between 
        items-center 
        text-lg w-full"
			>
				<div className="flex gap-20 justify-around items-center ">
					<Link
						href={"/"}
						className="inline-flex text-[24px] hover:cursor-pointer hover:opacity-50 active:opacity-50"
					>
						<Image
							src={"/images/logo/logo-white.png"}
							width={180}
							height={50}
							alt="logo"
						/>
					</Link>
				</div>
				<div className="flex gap-20 justify-around items-center">
					{/* <TransitionLink href="/reviews" label="Review" />{" "} */}
					<Link
						href={"/reviews"}
						className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
					>
						Reviews
					</Link>
					<Link
						href={"/pricing"}
						className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
					>
						Pricing
					</Link>
					<Link
						href={"/contact"}
						className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
					>
						Contact
					</Link>
					<div>
						<Image
							src={"/profile.png"}
							width={35}
							className="hover:cursor-pointer hover:opacity-50"
							height={35}
							alt="location"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
