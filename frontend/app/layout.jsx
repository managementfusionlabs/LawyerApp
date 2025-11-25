import "./globals.css";

export const metadata = {
  title: "LegalJK",
  description: "Lawyer Case Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
