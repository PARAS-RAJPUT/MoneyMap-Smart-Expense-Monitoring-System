import "../styles/globals.css";

export const metadata = {
  title: "Expense Tracker",
  description: "Track your daily expenses"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
