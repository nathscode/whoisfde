import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface LoadingButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading: boolean;
	variant?: any;
}

export default function LoadingButton({
	children,
	variant,
	loading,
	...props
}: LoadingButtonProps) {
	return (
		<Button {...props} variant={variant} disabled={props.disabled || loading}>
			<span className="flex items-center justify-center gap-1">
				{loading && <Loader2 size={16} className="animate-spin" />}
				{children}
			</span>
		</Button>
	);
}
