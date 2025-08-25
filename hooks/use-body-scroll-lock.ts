// hooks/useBodyScrollLock.ts
import { useEffect } from "react";

export const useBodyScrollLock = (isLocked: boolean = true) => {
	useEffect(() => {
		if (!isLocked) return;

		// Store original body overflow
		const originalOverflow = document.body.style.overflow;
		const originalHeight = document.body.style.height;

		// Lock body scroll
		document.body.style.overflow = "hidden";
		document.body.style.height = "100vh";
		document.body.classList.add("doom-scroll-active");

		// Prevent scroll on touch devices
		const preventScroll = (e: TouchEvent) => {
			e.preventDefault();
		};

		// Add touch event listeners
		document.addEventListener("touchmove", preventScroll, { passive: false });

		return () => {
			// Restore original body overflow
			document.body.style.overflow = originalOverflow;
			document.body.style.height = originalHeight;
			document.body.classList.remove("doom-scroll-active");

			// Remove touch event listeners
			document.removeEventListener("touchmove", preventScroll);
		};
	}, [isLocked]);
};
