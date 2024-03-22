import { ReactNode } from "react";

type PaddingProps = {
  children: ReactNode;
  className?: string;
};

export default function Padding({ children, className = "" }: PaddingProps) {
  return (
    <div
      className={`
    px-2 
    sm:px-[75px] 
    md:px-[150px]
    lg:px-[200px] 
    xl:px-[250px]
    ${className}
    `}
    >
      {children}
    </div>
  );
}
