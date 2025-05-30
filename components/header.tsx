import { ThemeSwitcher } from "./theme-switcher";
import AuthButtons from "./auth-buttons";

const Header = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 bg-muted/50 border-b border-muted/20">
      <AuthButtons />
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
