"use client";

import Image from "next/image";
import { useRef, useState, useEffect, MutableRefObject, ReactNode } from "react";

function TabController({
  children,
  onTabPress: callback,
  indicatorColor,
  activeElementColor,
  railColor,
  elementsStyle
}: {
  children: ReactNode[];
  onTabPress?: (index: number) => void;
  indicatorColor: string;
  railColor?: string;
  activeElementColor: string;
  elementsStyle: string
}) {
  const [lp, setLm] = useState(0);
  const position = useRef(0);
  const [indicatorWidth, setWidth] = useState(0);
  const [canShowIndicator, setCanUseIndicator] = useState(false);
  const offsetLeft = useRef(0);
  const refs = useRef<Array<HTMLDivElement | null>>([])
  const offsetRef = useRef(null)

  const styles = [`hover:cursor-pointer text-[${activeElementColor}]`, "hover:cursor-pointer text-black"];

  const slideTo = () => {
    setWidth((refs.current[position.current]! as Element).getBoundingClientRect().width);
    offsetLeft.current = (offsetRef.current! as Element).getBoundingClientRect().left;
    setLm(
      (refs.current[position.current]! as Element).getBoundingClientRect().left - offsetLeft.current
    );
  };

  useEffect(() => {


    setCanUseIndicator(true);
    slideTo();

    window.addEventListener("resize", slideTo);

    return () => {
      window.removeEventListener("resize", slideTo);
    };
  }, []);

  return (
    <div className="w-full">
      <div className={elementsStyle}>
        {children.map((child, index) => (
          <div
            key={index}
            ref={e => refs.current[index] = e}
            onClick={() => {
              position.current = index;
              slideTo();
              if (callback) {
                callback(index);
              }
            }}
            className={position.current === index ? styles[0] : styles[1]}
          >
            {child}
          </div>
        ))}
      </div>
      <div
        ref={offsetRef}
        style={{backgroundColor: railColor ? railColor : "inherit"}}
        className={`h-[2.5px] relative w-full flex items-center rounded-full`}
      >
        {canShowIndicator ? (
          <div
            style={{ left: lp, width: indicatorWidth, transition: "left 0.25s linear" }}
            className={`absolute bg-[${indicatorColor}] h-[2.5px] rounded-full hover:cursor-pointer`}
          />
        ) : null}
      </div>
    </div>
  );
}

export default TabController;
