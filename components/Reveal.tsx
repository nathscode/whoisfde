import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";

type Props = {
	children: React.ReactNode;
	width?: "fit-content" | "100%";
};

const Reveal = ({ children, width }: Props) => {
	const mainControls = useAnimation();
	const slideControls = useAnimation();
	const ref = useRef(null);
	const inView = useInView(ref, { once: true });

	useEffect(() => {
		if (inView) {
			mainControls.start("visible");
			slideControls.start("visible");
		}
	}, [inView, mainControls, slideControls]);
	return (
		<div style={{ position: "relative", width, overflow: "hidden" }}>
			<div ref={ref}>
				<motion.div
					variants={{
						hidden: { opacity: 0, y: 75 },
						visible: { opacity: 1, y: 0 },
					}}
					initial="hidden"
					animate={mainControls}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					{children}
				</motion.div>
				<motion.div
					variants={{
						hidden: { left: 0 },
						visible: { left: "100%" },
					}}
					initial="hidden"
					animate={slideControls}
					transition={{ duration: 0.5, ease: "easeIn" }}
					style={{
						position: "absolute",
						top: 4,
						bottom: 4,
						left: 0,
						right: 0,
						background: "#94a3b8",
						zIndex: 20,
					}}
				></motion.div>
			</div>
		</div>
	);
};

export default Reveal;
