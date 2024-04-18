import nodemailer from "nodemailer";
import type { TransportOptions, Transport } from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const secure = process.env.SMTP_SECURE;
const verbose = process.env.MAIL_SMTP_VERBOSE;

export default async function getTransporter() {
    const options = {
        host: host ? host : null,
        port: port ? port : null,
        secure: secure ? secure === 'true' : false,
        auth: {
            user: user ? user : null,
            pass: pass ? pass : null,
        },
        tls: {
            ciphers: 'SSLv3',
        },
    } as TransportOptions | Transport<unknown>;

    if (verbose && verbose == "true") {
        console.log({ options });
    }

    return nodemailer.createTransport(options);
}
