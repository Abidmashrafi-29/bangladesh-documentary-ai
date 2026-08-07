import "./globals.css";

// LEARNING NOTE: layout.tsx wraps EVERY page in the app (Next.js App Router convention).
// It's the right place for a shared header/nav, fonts, and global CSS.

export const metadata = {
  title: "Abid Mashrafi | Documentaries",
  description: "A documentary and vlog series exploring Bangladesh, with an AI chatbot to answer your questions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a href="/" className="logo">Wandering Lens</a>
          <nav>
            <a href="/documentaries">Documentaries</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>Built by Abid Mashrafi</p>
        </footer>
      </body>
    </html>
  );
}
