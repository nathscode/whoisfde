import { formatWithComma } from "@/lib/price-format";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function FadeOnScroll({ child }: { child: ReactNode }) {
  const elementRef = useRef(null);
  const elementHeight = useRef(0);
  const [opacity, setOpacity] = useState(1);
  const [wasResized, setWasResized] = useState(false);
  const topOffset = useRef(0);
  const staticOffset = useRef(0);

  const a = formatWithComma(90);

  const handleScroll = () => {
    topOffset.current = (elementRef.current! as Element).getBoundingClientRect().top;
    const offsetTop = topOffset.current;
    if (offsetTop > 0) {
      return;
    }
    //this bit is nice efficiency wise
    //but it removes the listener from backward scrolling
    //in order words, when you scroll up, your elements are gone
    // else if(scrolledExtent > offsetTop + elementHeight.current){
    //   window.removeEventListener("scroll", handleScroll)
    //   return
    // }

    setOpacity(1 - (window.scrollY - staticOffset.current) / elementHeight.current);
  };

  const screenResize = () => setWasResized(!wasResized);

  useEffect(() => {
    staticOffset.current = (elementRef.current! as Element).getBoundingClientRect().top;
    elementHeight.current = (elementRef.current! as Element).getBoundingClientRect().height;
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", screenResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", screenResize);
    };
  }, [wasResized]);

  return (
    <div ref={elementRef} style={{ opacity: opacity, transition: "opacity 0.275s linear" }}>
      {child}
    </div>
  );
}
