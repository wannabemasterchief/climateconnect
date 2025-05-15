import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/ui-components/navbar"
import { Footer } from "@/components/ui-components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClimateConnect",
  description: "Connect with climate innovators, investors, and changemakers",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user || null

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
