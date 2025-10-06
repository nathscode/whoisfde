"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

type MarqueeProps = {
	children: React.ReactNode;
	speed?: number;
	pauseOnHover?: boolean;
	reverse?: boolean;
	className?: string;
};

const Marquee = ({
	children,
	speed = 50,
	pauseOnHover = true,
	reverse = false,
	className,
}: MarqueeProps) => {
	const marqueeRef = useRef<HTMLDivElement>(null);
	const [isPaused, setIsPaused] = useState(false);

	return (
		<div
			className={cn("relative overflow-hidden", className)}
			onMouseEnter={() => pauseOnHover && setIsPaused(true)}
			onMouseLeave={() => pauseOnHover && setIsPaused(false)}
		>
			<div
				ref={marqueeRef}
				className="flex w-fit"
				style={{
					animation: `marquee ${speed}s linear infinite`,
					animationDirection: reverse ? "reverse" : "normal",
					animationPlayState: isPaused ? "paused" : "running",
				}}
			>
				{/* First set of children */}
				<div className="flex shrink-0 items-center gap-4 md:gap-8">
					{children}
				</div>
				{/* Duplicate for seamless loop */}
				<div
					className="flex shrink-0 items-center gap-4 md:gap-8"
					aria-hidden="true"
				>
					{children}
				</div>
			</div>

			<style jsx>{`
				@keyframes marquee {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
			`}</style>
		</div>
	);
};
export default Marquee;
