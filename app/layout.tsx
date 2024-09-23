import "./globals.css"

import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] ,weight:["100","200","300","400","500","600","700","800","900"]})

export const generateMetadata = () => {
  return {
    title: { template: "%s | Whats up", default: "Whats up" },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="bg-background text-foreground h-dvh m-0 p-0 box-border text-lg font-medium">
        {children}
      </body>
    </html>
  )
}
