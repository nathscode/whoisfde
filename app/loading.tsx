import React from "react";
import "./loader.css";

export default function Loading() {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="gooey">
				<span className="dot"></span>
				<div className="dots">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
		</div>
	);
}
