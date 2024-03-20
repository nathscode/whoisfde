import { Dispatch, SetStateAction } from "react";
import ExpandedNav from "./expanded-nav";
import MinimizedTopNav from "./minimized-nav";

export default function Nav({setHomeSection}:{setHomeSection: Dispatch<SetStateAction<JSX.Element>>}) {
  return (
    <div className="mb-[50px]">
      <div className="lg:hidden">
        <MinimizedTopNav setHomeSection={setHomeSection} />
      </div>
      <div className="hidden lg:block">
        <ExpandedNav setHomeSection={setHomeSection} />
      </div>
    </div>
  );
};
