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
  const position = useRef(1);
  const [indicatorWidth, setWidth] = useState(0);
  const [canShowIndicator, setCanUseIndicator] = useState(false);
  const offsetLeft = useRef(0);
  
  //we adding 1 to get an additional offset getter
  //the first ref is always for determining our offset
  //the offset is for things like margin; in our case left
  const refs: MutableRefObject<null>[] = Array.from(new Array(children.length + 1)).map(_ => useRef(null));

  const styles = [`hover:cursor-pointer text-[${activeElementColor}]`, "hover:cursor-pointer text-black"];

  const slideTo = () => {
    setWidth((refs[position.current].current! as Element).getBoundingClientRect().width);
    offsetLeft.current = (refs[0].current! as Element).getBoundingClientRect().left;
    setLm(
      (refs[position.current].current! as Element).getBoundingClientRect().left - offsetLeft.current
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
            ref={refs[index + 1]}
            onClick={() => {
              position.current = index + 1;
              slideTo();
              if (callback) {
                callback(index);
              }
            }}
            className={position.current === index + 1 ? styles[0] : styles[1]}
          >
            {child}
          </div>
        ))}
      </div>
      <div
        ref={refs[0]}
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
