const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground space-y-2">
      <p>
        &copy; {new Date().getFullYear()} PixelVerse - Portfolio Project by
        Ondřej Pták
      </p>

      <p>
        Made with ❤️ by{" "}
        <a
          href="https://github.com/florixak"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Ondřej Pták
        </a>
      </p>

      <p className="text-xs max-w-2xl mx-auto">
        This is a personal portfolio project for educational and demonstration
        purposes. Content includes a mix of original work and third-party
        materials used under fair use for learning. © {new Date().getFullYear()}{" "}
        Ondřej Pták.
      </p>

      <p className="text-xs text-muted-foreground/70">
        Third-party content belongs to their respective owners and is used for
        educational purposes only.
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
        <a href="/contact" className="hover:underline">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
