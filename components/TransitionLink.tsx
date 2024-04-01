"use client";

import { animatePageOut } from "@/lib/page-animation";
import { useRouter } from "next/navigation";

export default function TransitionLink({
	href,
	label,
}: {
	href: string;
	label: string;
}) {
	const router = useRouter();

	const handleClick = () => {
		animatePageOut(href, router);
	};

	return (
		<button
			className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
			onClick={handleClick}
		>
			{label}
		</button>
	);
}
