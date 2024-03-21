import { Dispatch, SetStateAction } from "react";
import ExpandedNav from "./expanded-nav";
import MinimizedTopNav from "./minimized-nav";

export default function Nav({setHomeSection}:{setHomeSection: Dispatch<SetStateAction<JSX.Element>>}) {
  return (
    <div className="">
      <div className="md:hidden">
        <MinimizedTopNav setHomeSection={setHomeSection} />
      </div>
      <div className="hidden md:block">
        <ExpandedNav setHomeSection={setHomeSection} />
      </div>
    </div>
  );
};
