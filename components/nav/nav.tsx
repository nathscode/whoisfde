import { CustomUser } from "@/types";
import ExpandedNav from "./expanded-nav";
import MinimizedTopNav from "./minimized-nav";
type Props = {
	session: CustomUser;
};

const NavBar = ({ session }: Props) => {
	return (
		<div className="">
			<div className="sm:hidden">
				<MinimizedTopNav session={session!} />
			</div>
			<div className="max-sm:hidden">
				<ExpandedNav session={session!} />
			</div>
		</div>
	);
};

export default NavBar;
