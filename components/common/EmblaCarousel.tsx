import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
	children?: React.ReactNode;
	onSlideChange?: (index: number) => void;
	onInit?: (emblaApi: any) => void;
};

const EmblaCarousel: React.FC<PropType> = ({
	children,
	onSlideChange,
	onInit,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		axis: "y",
		dragFree: false,
		containScroll: false,
		skipSnaps: false,
		align: "start",
		duration: 25,
		startIndex: 0,
	});

	// Initialize API callback
	useEffect(() => {
		if (emblaApi && onInit) {
			onInit(emblaApi);
		}
	}, [emblaApi, onInit]);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		const index = emblaApi.selectedScrollSnap();
		setCurrentIndex(index);
		onSlideChange?.(index);
	}, [emblaApi, onSlideChange]);

	// Handle wheel events for smooth scrolling
	useEffect(() => {
		if (!emblaApi) return;

		let isScrolling = false;
		let scrollTimeout: NodeJS.Timeout;

		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();

			if (isScrolling) return;

			const delta = event.deltaY;
			const threshold = 50;

			if (Math.abs(delta) > threshold) {
				isScrolling = true;

				if (delta > 0) {
					emblaApi.scrollNext();
				} else {
					emblaApi.scrollPrev();
				}

				scrollTimeout = setTimeout(() => {
					isScrolling = false;
				}, 300);
			}
		};

		const viewport = emblaApi.rootNode();
		if (viewport) {
			viewport.addEventListener("wheel", handleWheel, { passive: false });
		}

		emblaApi.on("select", onSelect);

		return () => {
			if (viewport) {
				viewport.removeEventListener("wheel", handleWheel);
			}
			emblaApi.off("select", onSelect);
			if (scrollTimeout) clearTimeout(scrollTimeout);
		};
	}, [emblaApi, onSelect]);

	// Handle keyboard navigation
	useEffect(() => {
		if (!emblaApi) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					event.preventDefault();
					emblaApi.scrollPrev();
					break;
				case "ArrowDown":
					event.preventDefault();
					emblaApi.scrollNext();
					break;
				case "Home":
					event.preventDefault();
					emblaApi.scrollTo(0);
					break;
				case "End":
					event.preventDefault();
					emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [emblaApi]);

	// Handle touch gestures
	useEffect(() => {
		if (!emblaApi) return;

		let touchStartY = 0;
		let touchEndY = 0;
		let isSwipingVertically = false;

		const handleTouchStart = (event: TouchEvent) => {
			touchStartY = event.touches[0].clientY;
			isSwipingVertically = false;
		};

		const handleTouchMove = (event: TouchEvent) => {
			const currentY = event.touches[0].clientY;
			const deltaY = Math.abs(currentY - touchStartY);
			const deltaX = Math.abs(event.touches[0].clientX - touchStartY);

			if (deltaY > deltaX && deltaY > 20) {
				isSwipingVertically = true;
				event.preventDefault();
			}
		};

		const handleTouchEnd = (event: TouchEvent) => {
			if (!isSwipingVertically) return;

			touchEndY = event.changedTouches[0].clientY;
			const swipeDistance = touchStartY - touchEndY;
			const minSwipeDistance = 50;

			if (Math.abs(swipeDistance) > minSwipeDistance) {
				if (swipeDistance > 0) {
					emblaApi.scrollNext();
				} else {
					emblaApi.scrollPrev();
				}
			}
		};

		const viewport = emblaApi.rootNode();
		if (viewport) {
			viewport.addEventListener("touchstart", handleTouchStart, {
				passive: false,
			});
			viewport.addEventListener("touchmove", handleTouchMove, {
				passive: false,
			});
			viewport.addEventListener("touchend", handleTouchEnd, { passive: false });
		}

		return () => {
			if (viewport) {
				viewport.removeEventListener("touchstart", handleTouchStart);
				viewport.removeEventListener("touchmove", handleTouchMove);
				viewport.removeEventListener("touchend", handleTouchEnd);
			}
		};
	}, [emblaApi]);

	return (
		<div className="embla h-screen w-full overflow-hidden relative bg-black">
			<div className="embla__viewport h-full" ref={emblaRef}>
				<div className="embla__container h-full">
					{React.Children.map(children, (child, index) => (
						<div
							key={index}
							className="embla__slide h-screen w-full flex-shrink-0 snap-start"
						>
							{child}
						</div>
					))}
				</div>
			</div>

			{/* Scroll indicators */}
			<div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-10">
				{React.Children.map(children, (_, index) => (
					<button
						key={index}
						className={`w-1 h-8 rounded-full transition-all duration-200 ${
							index === currentIndex
								? "bg-white"
								: "bg-white bg-opacity-40 hover:bg-opacity-60"
						}`}
						onClick={() => emblaApi?.scrollTo(index)}
						aria-label={`Go to video ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
};

export default EmblaCarousel;
