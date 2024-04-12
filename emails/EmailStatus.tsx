import { formatDateTime } from "@/lib/utils";
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
	phone: string;
	type: string;
	bookDate: Date;
	bookNumber: string;
	status: string;
}

const EmailStatus = ({
	name,
	email,
	phone,
	type,
	bookDate,
	bookNumber,
	status,
}: Props) => {
	return (
		<Html>
			<Head />
			<Preview>Whoisfde Booking Status</Preview>
			<Body style={main}>
				<Container style={parentContainer}>
					<Section style={{ marginTop: "32px" }}>
						<Img
							src={`https://whoisfde.vercel.app/_next/image?url=%2Fimages%2Flogo%2Flogo-question.png&w=96&q=75`}
							width="80"
							height="80"
							alt="Vercel"
							style={logo}
						/>
					</Section>
					<Section style={{ marginTop: "32px" }}>
						<Text style={h1}>
							<strong>Booking Status</strong>
						</Text>
						<Text style={paragraph}>Dear {name}</Text>
						<Text style={paragraph}>
							Your booking status &nbsp;
							<strong>{status === "SUCCESS" ? "Approved" : status}</strong>
						</Text>
						<Text style={paragraph}>Your booking information are below:</Text>
					</Section>
					<Section style={{ marginTop: "32px" }}>
						<table
							width={"94%"}
							style={spacing}
							border={0}
							cellPadding="0"
							cellSpacing="10"
							align="center"
						>
							<tr>
								<td width="70%" align="left" style={tableStyleTop}>
									Name
								</td>
								<td width="30%" align="right" style={tableStyleTop}>
									{name}
								</td>
							</tr>
							<tr>
								<td width="70%" align="left" style={tableStyle}>
									Email
								</td>
								<td width="30%" align="right" style={tableStyle}>
									{email}
								</td>
							</tr>
							<tr>
								<td width="70%" align="left" style={tableStyleTop}>
									Phone
								</td>
								<td width="30%" align="right" style={tableStyleTop}>
									{phone}
								</td>
							</tr>
							<tr>
								<td width="70%" align="left" style={tableStyle}>
									Booking ID
								</td>
								<td width="30%" align="right" style={tableStyle}>
									{bookNumber}
								</td>
							</tr>
							<tr>
								<td width="70%" align="left" style={tableStyleTop}>
									Booking Type
								</td>
								<td width="30%" align="right" style={tableStyleTop}>
									{type}
								</td>
							</tr>
							<tr>
								<td width="70%" align="left" style={tableStyle}>
									Date
								</td>
								<td width="30%" align="right" style={tableStyle}>
									{formatDateTime(bookDate.toString())}
								</td>
							</tr>
						</table>
					</Section>
					<Section style={{ textAlign: "center" }}>
						<Link
							href={`${process.env.NEXT_PUBLIC_APP_URL}/booking/${bookNumber}}`}
							style={cta}
						>
							View Booking
						</Link>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default EmailStatus;
const main = {
	backgroundColor: "#ffffff",
	margin: "auto auto",
	color: "#000",
	fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const parentContainer = {
	border: "1px solid #eaeaea",
	margin: "40px auto",
	width: "450px",
	padding: "1.2rem",
};

const heroSection = {
	position: "relative" as const,
	width: "100%",
	display: "inline-block",
};
const logo = {
	margin: "0 auto",
	backgroundColor: "#EEEEEE",
	borderRadius: "9999px",
};
const cta = {
	padding: "13px 20px",
	borderRadius: "5px",
	backgroundColor: "#000000",
	textAlign: "center" as const,
	color: "#fff",
	display: "block",
	width: "80%",
	margin: "0.5rem auto 0 auto",
};

const h1 = {
	color: "#000",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "24px",
	fontWeight: "normal",
	textAlign: "center" as const,
	margin: "30px 0",
	padding: "0",
};

const paragraph = {
	color: "#525f7f",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
};

const text = {
	color: "#000",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	lineHeight: "24px",
};

const tableStyle = {
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	color: "#252525",
	padding: "10px",
	paddingLeft: 0,
};
const tableStyleBold = {
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	color: "#252525",
	padding: "10px",
	fontWeight: "700",
	paddingLeft: 0,
};
const tableStyleTop = {
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	color: "#252525",
	backgroundColor: "#EEEEEE",
	padding: "10px",
	paddingLeft: 0,
};

const link = {
	color: "#444",
	textDecoration: "underline",
};
const spacing = {
	marginBottom: "26px",
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
