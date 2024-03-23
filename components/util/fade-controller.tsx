import { ReactNode, useEffect, useRef, useState } from "react";

export default function FadeOnScroll({ children }: { children: ReactNode }) {
  const elementRef = useRef(null);
  const elementHeight = useRef(0);
  const [opacity, setOpacity] = useState(1);
  const topOffset = useRef(0);

  const handleScroll = () => {
    topOffset.current = (elementRef.current! as Element).getBoundingClientRect().top;

    setOpacity(1 - (window.scrollY) / elementHeight.current);
  };

  useEffect(() => {
    elementHeight.current = (elementRef.current! as Element).getBoundingClientRect().height;
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={elementRef} style={{ opacity: opacity, transition: "opacity 0.275s linear" }}>
      {children}
    </div>
  );
}
