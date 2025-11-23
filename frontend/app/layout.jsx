import "./globals.css";

export const metadata = {
  title: "LegalJK",
  description: "Lawyer Case Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
