import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="default" size="sm">
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
