// Global site footer (server component). Mounted once in app/layout.tsx so it
// renders on the homepage, beat pages, kit pages, legal pages, and /confirmed.
// The body's padding-bottom (style.css) keeps it clear of the fixed PlayerBar.
export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-footer-copy">© 2026 prod.essential</span>
      <nav className="site-footer-links" aria-label="Legal">
        <a href="/privacy/">privacy</a>
        <a href="/terms/">terms</a>
        <a href="/#licensing">licensing</a>
      </nav>
    </footer>
  );
}
