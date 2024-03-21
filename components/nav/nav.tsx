import { Dispatch, SetStateAction } from "react";
import ExpandedNav from "./expanded-nav";
import MinimizedTopNav from "./minimized-nav";

export default function Nav({setHomeSection}:{setHomeSection: Dispatch<SetStateAction<JSX.Element>>}) {
  return (
    <div className="">
      <div className="sm:hidden">
        <MinimizedTopNav setHomeSection={setHomeSection} />
      </div>
      <div className="max-sm:hidden">
        <ExpandedNav setHomeSection={setHomeSection} />
      </div>
    </div>
  );
};
