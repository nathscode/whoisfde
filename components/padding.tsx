import { ReactElement } from "react";

export default function Padding({ children }: { children: ReactElement }) {
  return <div className="w-full px-10 xl:px-56">{children}</div>;
}
