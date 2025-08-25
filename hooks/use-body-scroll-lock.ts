// hooks/useFullscreenScrollFix.ts
"use client";

import { useEffect, useRef, useCallback } from "react";

interface ScrollPosition {
	x: number;
	y: number;
}

interface UseFullscreenScrollFixOptions {
	preventScrollJump?: boolean;
	restoreOnExit?: boolean;
	disableBodyScroll?: boolean;
}

export const useFullscreenScrollFix = (
	options: UseFullscreenScrollFixOptions = {}
) => {
	const {
		preventScrollJump = true,
		restoreOnExit = true,
		disableBodyScroll = true,
	} = options;

	const savedScrollPosition = useRef<ScrollPosition>({ x: 0, y: 0 });
	const savedBodyStyle = useRef<{
		overflow: string;
		position: string;
		width: string;
		height: string;
		top: string;
		left: string;
		touchAction: string;
		webkitOverflowScrolling: string;
	}>({
		overflow: "",
		position: "",
		width: "",
		height: "",
		top: "",
		left: "",
		touchAction: "",
		webkitOverflowScrolling: "",
	});

	const isFullscreenRef = useRef(false);
	const isMobileRef = useRef(false);

	// Detect mobile device
	const detectMobile = useCallback(() => {
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) ||
			window.innerWidth < 768 ||
			"ontouchstart" in window;
		isMobileRef.current = isMobile;
		return isMobile;
	}, []);

	const saveScrollPosition = useCallback(() => {
		if (!preventScrollJump) return;

		savedScrollPosition.current = {
			x: window.pageXOffset || document.documentElement.scrollLeft || 0,
			y: window.pageYOffset || document.documentElement.scrollTop || 0,
		};

		console.log(
			"Saved scroll position:",
			savedScrollPosition.current,
			"Mobile:",
			isMobileRef.current
		);
	}, [preventScrollJump]);

	const saveBodyStyle = useCallback(() => {
		const bodyStyle = document.body.style;
		const computedStyle = window.getComputedStyle(document.body);

		savedBodyStyle.current = {
			overflow: bodyStyle.overflow,
			position: bodyStyle.position,
			width: bodyStyle.width,
			height: bodyStyle.height,
			top: bodyStyle.top,
			left: bodyStyle.left,
			touchAction: bodyStyle.touchAction || computedStyle.touchAction,
			webkitOverflowScrolling:
				// @ts-ignore
				bodyStyle.webkitOverflowScrolling ||
				// @ts-ignore
				computedStyle.webkitOverflowScrolling,
		};
	}, []);

	const preventBodyScroll = useCallback(() => {
		if (!disableBodyScroll) return;

		saveBodyStyle();

		const bodyStyle = document.body.style;
		const htmlStyle = document.documentElement.style;

		if (isMobileRef.current) {
			// Mobile-specific scroll prevention
			bodyStyle.overflow = "hidden";
			bodyStyle.position = "fixed";
			bodyStyle.width = "100%";
			bodyStyle.height = "100vh";
			bodyStyle.top = `-${savedScrollPosition.current.y}px`;
			bodyStyle.left = `-${savedScrollPosition.current.x}px`;
			bodyStyle.touchAction = "none";
			// @ts-ignore
			bodyStyle.webkitOverflowScrolling = "auto";

			// Also lock the html element on mobile
			htmlStyle.overflow = "hidden";
			htmlStyle.height = "100vh";
			htmlStyle.touchAction = "none";

			// Prevent iOS Safari bounce scroll
			document.addEventListener("touchmove", preventDefault, {
				passive: false,
			});
			document.addEventListener("touchstart", preventDefaultConditional, {
				passive: false,
			});
		} else {
			// Desktop scroll prevention
			bodyStyle.overflow = "hidden";
			bodyStyle.position = "fixed";
			bodyStyle.width = "100%";
			bodyStyle.height = "100%";
			bodyStyle.top = `-${savedScrollPosition.current.y}px`;
			bodyStyle.left = `-${savedScrollPosition.current.x}px`;
		}

		console.log("Body scroll prevented (Mobile:", isMobileRef.current, ")");
	}, [disableBodyScroll, saveBodyStyle]);

	const restoreBodyStyle = useCallback(() => {
		if (!disableBodyScroll) return;

		const bodyStyle = document.body.style;
		const htmlStyle = document.documentElement.style;
		const saved = savedBodyStyle.current;

		// Remove event listeners first (mobile)
		if (isMobileRef.current) {
			document.removeEventListener("touchmove", preventDefault);
			document.removeEventListener("touchstart", preventDefaultConditional);

			// Restore HTML styles
			htmlStyle.overflow = "";
			htmlStyle.height = "";
			htmlStyle.touchAction = "";
		}

		// Restore body styles
		bodyStyle.overflow = saved.overflow;
		bodyStyle.position = saved.position;
		bodyStyle.width = saved.width;
		bodyStyle.height = saved.height;
		bodyStyle.top = saved.top;
		bodyStyle.left = saved.left;
		bodyStyle.touchAction = saved.touchAction;
		// @ts-ignore
		bodyStyle.webkitOverflowScrolling = saved.webkitOverflowScrolling;

		console.log("Body style restored (Mobile:", isMobileRef.current, ")");
	}, [disableBodyScroll]);

	const restoreScrollPosition = useCallback(() => {
		if (!restoreOnExit) return;

		const { x, y } = savedScrollPosition.current;

		console.log(
			"Restoring scroll position to:",
			{ x, y },
			"Mobile:",
			isMobileRef.current
		);

		const scrollToPosition = () => {
			if (isMobileRef.current) {
				// Mobile-specific scroll restoration
				window.scrollTo({
					left: x,
					top: y,
					behavior: "instant",
				});

				// Additional mobile fallbacks
				document.documentElement.scrollLeft = x;
				document.documentElement.scrollTop = y;
				document.body.scrollLeft = x;
				document.body.scrollTop = y;

				// Force repaint on mobile
				document.body.style.transform = "translateZ(0)";
				requestAnimationFrame(() => {
					document.body.style.transform = "";
				});
			} else {
				// Desktop scroll restoration
				window.scrollTo(x, y);
				document.documentElement.scrollLeft = x;
				document.documentElement.scrollTop = y;
			}
		};

		// Multiple restoration attempts with mobile-optimized timing
		scrollToPosition();

		requestAnimationFrame(() => {
			scrollToPosition();

			setTimeout(scrollToPosition, isMobileRef.current ? 50 : 10);
			setTimeout(scrollToPosition, isMobileRef.current ? 150 : 50);
			setTimeout(scrollToPosition, isMobileRef.current ? 300 : 100);
		});
	}, [restoreOnExit]);

	// Prevent default touch events
	const preventDefault = useCallback((e: TouchEvent) => {
		e.preventDefault();
	}, []);

	const preventDefaultConditional = useCallback((e: TouchEvent) => {
		// Only prevent if not interacting with video controls
		const target = e.target as Element;
		if (!target.closest('[data-video-player="true"]')) {
			e.preventDefault();
		}
	}, []);

	const handleFullscreenChange = useCallback(() => {
		const currentlyFullscreen = !!document.fullscreenElement;

		console.log("Fullscreen change:", {
			from: isFullscreenRef.current,
			to: currentlyFullscreen,
			mobile: isMobileRef.current,
		});

		if (currentlyFullscreen && !isFullscreenRef.current) {
			// Entering fullscreen
			console.log("Entering fullscreen");
			isFullscreenRef.current = true;
			detectMobile();

			if (preventScrollJump) {
				saveScrollPosition();
				preventBodyScroll();
			}
		} else if (!currentlyFullscreen && isFullscreenRef.current) {
			// Exiting fullscreen
			console.log("Exiting fullscreen");
			isFullscreenRef.current = false;

			if (preventScrollJump) {
				restoreBodyStyle();

				// Mobile-optimized timing for scroll restoration
				const delays = isMobileRef.current
					? [0, 50, 150, 300, 500]
					: [0, 10, 50, 100];

				delays.forEach((delay) => {
					setTimeout(() => {
						restoreScrollPosition();
					}, delay);
				});
			}
		}
	}, [
		preventScrollJump,
		saveScrollPosition,
		preventBodyScroll,
		restoreBodyStyle,
		restoreScrollPosition,
		detectMobile,
	]);

	useEffect(() => {
		detectMobile();

		// Override browser's scroll restoration
		if ("scrollRestoration" in history) {
			const originalScrollRestoration = history.scrollRestoration;
			history.scrollRestoration = "manual";

			return () => {
				history.scrollRestoration = originalScrollRestoration;
			};
		}
	}, [detectMobile]);

	useEffect(() => {
		// Add fullscreen event listeners
		const events = [
			"fullscreenchange",
			"webkitfullscreenchange",
			"mozfullscreenchange",
			"MSFullscreenChange",
		];

		events.forEach((event) => {
			document.addEventListener(event, handleFullscreenChange, {
				passive: false,
			});
		});

		// Mobile-specific event listeners
		const handleOrientationChange = () => {
			if (isFullscreenRef.current) {
				setTimeout(() => {
					restoreScrollPosition();
				}, 100);
			}
		};

		const handleResize = () => {
			detectMobile();
			if (isFullscreenRef.current) {
				setTimeout(() => {
					restoreScrollPosition();
				}, 100);
			}
		};

		window.addEventListener("orientationchange", handleOrientationChange);
		window.addEventListener("resize", handleResize);

		const handleVisibilityChange = () => {
			if (document.hidden && isFullscreenRef.current) {
				console.log("Document became hidden during fullscreen");
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			events.forEach((event) => {
				document.removeEventListener(event, handleFullscreenChange);
			});

			window.removeEventListener("orientationchange", handleOrientationChange);
			window.removeEventListener("resize", handleResize);
			document.removeEventListener("visibilitychange", handleVisibilityChange);

			// Emergency cleanup
			if (isFullscreenRef.current) {
				restoreBodyStyle();
				console.log("Emergency cleanup performed");
			}
		};
	}, [
		handleFullscreenChange,
		restoreBodyStyle,
		restoreScrollPosition,
		detectMobile,
	]);

	// Handle page refresh or navigation during fullscreen
	useEffect(() => {
		const handleBeforeUnload = () => {
			if (isFullscreenRef.current) {
				restoreBodyStyle();
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [restoreBodyStyle]);

	return {
		saveScrollPosition,
		restoreScrollPosition,
		isFullscreen: isFullscreenRef.current,
		isMobile: isMobileRef.current,
	};
};
