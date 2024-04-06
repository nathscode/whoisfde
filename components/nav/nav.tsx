import getCurrentUser from "@/actions/getCurrentUser";
import ExpandedNav from "./expanded-nav";
import MinimizedTopNav from "./minimized-nav";
import { CustomUser } from "@/types";
type Props = {
	session: CustomUser;
};

const NavBar = ({ session }: Props) => {
	return (
		<div className="">
			<div className="sm:hidden">
				<MinimizedTopNav />
			</div>
			<div className="max-sm:hidden">
				<ExpandedNav session={session!} />
			</div>
		</div>
	);
};

export default NavBar;
