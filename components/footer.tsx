import React from "react";

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} PixelDit. All rights reserved.
      </p>
      <p className="text-sm text-muted-foreground">
        Made with ❤️ by Ondřej Pták.
      </p>
    </footer>
  );
};

export default Footer;
