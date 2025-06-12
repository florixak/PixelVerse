import { ThemeSwitcher } from "./theme-switcher";
import AuthButtons from "./auth-buttons";

const Header = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 border-b border-muted/20 w-full z-50 bg-background dark:bg-background/50 backdrop-blur-xs">
      <AuthButtons />
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
