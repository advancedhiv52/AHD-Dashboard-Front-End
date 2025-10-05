import "./globals.css";
import { Open_Sans, Raleway } from "next/font/google";
import Header from "./components/common/Header";

const open_sans = Open_Sans({
  variable: "--font-open_sans",
  subsets: ["latin"],
});
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});
export const metadata = {
  title: "Policy Lab Dashboard",
  description: "Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${raleway.className} ${open_sans.variable}  `}>
        <Header />
        {children}
      </body>
    </html>
  );
}
