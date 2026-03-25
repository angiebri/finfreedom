import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Личные финансы — Путь к $1 000 000",
  description: "Персональный финансовый дашборд",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
