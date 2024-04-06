import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface Props {
	name: string;
	email: string;
	password: string;
	code: string;
}

const SendVerificationEmail = ({ name, email, password, code }: Props) => {
	return (
		<Html>
			<Head />
			<Preview>Whoisfde OG's Email verification</Preview>
			<Body style={main}>
				<Container style={parentContainer}>
					<Section style={{ marginTop: "32px" }}>
						<Img
							src={`https://whoisfde.vercel.app/_next/image?url=%2Fimages%2Flogo%2Flogo-question.png&w=96&q=75`}
							width="80"
							height="37"
							alt="Vercel"
							style={logo}
						/>
					</Section>
					<Section>
						<Text style={paragraph}>
							<b>Name: </b>
							{name}
						</Text>
						<Text style={paragraph}>
							<b>Email: </b>
							{email}
						</Text>
						<Text style={paragraph}>
							<b>Password: </b>
							{password}
						</Text>
						<Section>
							<Link
								href={`${process.env.NEXT_PUBLIC_APP_URL}/auth/verify/?code=${code}`}
								style={cta}
							>
								Verify Email
							</Link>{" "}
						</Section>
						<Text style={paragraph}>
							{`${process.env.NEXT_PUBLIC_APP_URL}/auth/verify/?code=${code}&email=${email}`}
						</Text>
						<Text style={footer}>With Regard, WhoisFde Team</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default SendVerificationEmail;
const main = {
	backgroundColor: "#ffffff",
	margin: "auto auto",
	color: "#000",
	fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const parentContainer = {
	border: "1px solid #eaeaea",
	margin: "40px auto",
	width: "390px",
};

const container = {
	maxWidth: "90%",
	margin: "0 auto",
	padding: "1.2rem",
};

const heroSection = {
	position: "relative" as const,
	width: "100%",
	display: "inline-block",
};
const logo = {
	margin: "0 auto",
};
const cta = {
	padding: "13px 20px",
	borderRadius: "5px",
	backgroundColor: "#000000",
	textAlign: "center" as const,
	color: "#fff",
	display: "block",
	width: "45%",
	margin: "0.5rem auto 0 auto",
};

const paragraph = {
	color: "#444",
	fontSize: "15px",
	fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
	letterSpacing: "0",
	lineHeight: "23px",
	padding: "5px 40px",
	margin: "0",
};

const link = {
	color: "#444",
	textDecoration: "underline",
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
