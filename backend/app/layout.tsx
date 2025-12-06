import './globals.css'

export const metadata = {
  title: 'Home Goods API',
  description: 'API for the Home Goods E-commerce application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
