import { Montserrat } from "next/font/google";
import Navbar from "./Components/Navbar/Navbar";
import "./globals.css";
// import Footer from "./Components/Footer/Footer";

const montserrat = Montserrat({
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-montserrat", 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Navbar />
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
