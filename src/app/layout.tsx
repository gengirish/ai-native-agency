import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/lib/auth/session-provider"
import { AuthProvider } from "@/lib/auth/context"
import { AppShell } from "@/components/layout/app-shell"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

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
      <body className={`${inter.variable} ${poppins.variable} ${inter.className}`}>
        <SessionProvider>
          <AuthProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
