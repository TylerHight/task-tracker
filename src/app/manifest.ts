import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "Task Tracker", short_name: "Tracker", start_url: "/focus", display: "standalone", background_color: "#0b1120", theme_color: "#0b1120", icons: [{ src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "maskable" }] }; }
