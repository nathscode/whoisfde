import { ReactNode } from "react";

type PaddingProps = {
  children: ReactNode;
  className?: string;
};

export default function ReviewsPadding({ children, className = "" }: PaddingProps) {
  return (
    <div
      className={`
    px-2 
    sm:px-[75px] 
    md:px-[150px] 
    lg:px-[300px] 
    xl:px-[400px]
    ${className}
    `}
    >
      {children}
    </div>
  );
}
