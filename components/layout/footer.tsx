const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground space-y-2">
      <p>
        &copy; {new Date().getFullYear()} PixelVerse - Made by{" "}
        <a
          href="https://github.com/florixak"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Ondřej Pták
        </a>
      </p>

      <div className="flex justify-center gap-4 text-xs">
        <a
          href="https://github.com/florixak/pixelverse"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          View Source
        </a>
        <span>•</span>
        <a href="/about" className="hover:underline">
          About
        </a>
        <span>•</span>
        <a href="/terms" className="hover:underline">
          Terms
        </a>
        <span>•</span>
        <a href="/privacy" className="hover:underline">
          Privacy
        </a>
        <span>•</span>
        <a href="mailto:ptakondrej@seznam.cz" className="hover:underline">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
