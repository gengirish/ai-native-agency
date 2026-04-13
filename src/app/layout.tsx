import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/context"
import { AppShell } from "@/components/layout/app-shell"

const inter = Inter({ subsets: ["latin"] })

const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "AgencyOS — AI-Native Agency Platform",
  description:
    "Operating system for AI-native agencies: briefs, brand DNA, expert QA, SLAs, and delivery economics in one control plane.",
  openGraph: {
    title: "AgencyOS — Operating system for AI-native agencies",
    description:
      "Ship client creative at software-like margins. One workflow from intake to performance — with metered AI and human review.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
