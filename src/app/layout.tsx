import type { Metadata } from "next";
import { RegisterServiceWorker } from "@/pwa/register-service-worker";
import "@/styles/globals.css";
export const metadata: Metadata = { title: "Task Tracker", description: "A private focus timer" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><RegisterServiceWorker /><main>{children}</main></body></html>; }
