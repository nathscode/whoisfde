import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
	? `https://${process.env.NEXT_PUBLIC_APP_URL}`
	: "";

type PasswordProps = {
	token: string;
};

export const passwordResetEmail = ({
	token = "tt226-5398x",
}: PasswordProps) => (
	<Html>
		<Head />
		<Preview>Password reset</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={heading}>Password Reset</Heading>
				<Section style={buttonContainer}>
					<Button
						style={button}
						href={`${
							process.env.NEXT_PUBLIC_APP_URL
						}/account/${encodeURIComponent(token)}/reset`}
					>
						Reset password
					</Button>
				</Section>
				<Text style={paragraph}>
					This link and code will only be valid for the next 1 hour. Ignore
					message if you did not request for password reset.
				</Text>
			</Container>
			<Text style={footer}>With Regard, Whoisfde Team</Text>
		</Body>
	</Html>
);

export default passwordResetEmail;

const title = {
	fontSize: "32px",
	fontWeight: "bold",
	textAlign: "center" as const,
};

const logo = {
	borderRadius: 21,
	width: 42,
	height: 42,
};

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	width: "560px",
};

const heading = {
	fontSize: "24px",
	letterSpacing: "-0.5px",
	lineHeight: "1.3",
	fontWeight: "400",
	color: "#484848",
	padding: "17px 0 0",
};

const paragraph = {
	margin: "0 0 15px",
	fontSize: "15px",
	lineHeight: "1.4",
	color: "#3c4149",
};

const buttonContainer = {
	padding: "27px 0 27px",
};

const button = {
	backgroundColor: "#1d4fd7",
	borderRadius: "3px",
	fontWeight: "600",
	color: "#fff",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "11px 23px",
};

const footer = {
	color: "#000",
	fontSize: "12px",
	fontWeight: 800,
	letterSpacing: "0",
	lineHeight: "23px",
	margin: "0",
	marginTop: "20px",
	fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
	textAlign: "center" as const,
	textTransform: "uppercase" as const,
};
