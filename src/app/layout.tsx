import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/theme";
import { AuthProvider } from "@/components/auth";
import { Nav } from "@/components/nav";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const ibmPlexMono = IBM_Plex_Mono({ variable: "--font-ibm-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Coder's Zone — answers you can defend",
  description:
    "Try the problem first, then get code that's been run against real tests in C, C++, Java and Python — explained line by line.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-cz-theme="light" suppressHydrationWarning className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${bricolage.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Nav />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
