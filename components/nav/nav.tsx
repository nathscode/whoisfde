"use client";
import ExpandedNav from "./expanded-nav";
import MinimizedTopNav from "./minimized-nav";

export default function NavBar() {
	return (
		<div className="">
			<div className="sm:hidden">
				<MinimizedTopNav />
			</div>
			<div className="max-sm:hidden">
				<ExpandedNav />
			</div>
		</div>
	);
}
