import { hc } from "hono/client";
import { AppType } from "@/app/api/hono/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
// @ts-ignore
export const api = client.api;
