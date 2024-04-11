import axios from "axios";
import {
	Cog,
	LayoutDashboard,
	Mail,
	Receipt,
	UserCircle2,
	UsersRound,
} from "lucide-react";

export const apiClient = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
});
export const navLinks = [
	{
		url: "/dashboard",
		icon: <LayoutDashboard />,
		label: "Dashboard",
	},
	{
		url: "/dashboard/bookings",
		icon: <Receipt />,
		label: "Bookings",
	},
	{
		url: "/dashboard/reviews",
		icon: <Mail />,
		label: "Reviews",
	},
	{
		url: "/dashboard/requests",
		icon: <UserCircle2 />,
		label: "Requests",
	},
	{
		url: "/dashboard/users",
		icon: <UsersRound />,
		label: "Users",
	},
	{
		url: "/dashboard/works",
		icon: <Cog />,
		label: "Works",
	},
];
