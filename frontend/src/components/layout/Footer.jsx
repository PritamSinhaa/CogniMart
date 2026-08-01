function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} CogniMart. Shop smarter with AI.
      </div>
    </footer>
  );
}

export default Footer;