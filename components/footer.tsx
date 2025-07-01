const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} PixelVerse. All rights reserved.</p>
      <p>Made with ❤️ by Ondřej Pták.</p>
      <p>
        PixelVerse is a demonstration and not a live service. No real user data
        is collected or stored.
      </p>
    </footer>
  );
};

export default Footer;
