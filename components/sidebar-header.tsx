import Link from "next/link";
import { SidebarHeader as SidebarHead } from "@/components/ui/sidebar";

const SidebarHeader = () => {
  return (
    <SidebarHead className="flex items-center justify-center gap-2 p-4 overflow-hidden">
      <Link href="/">
        <h1 className="text-2xl font-bold overflow-hidden">
          <span className="text-primary">Pixel</span>Verse
        </h1>
      </Link>
    </SidebarHead>
  );
};

export default SidebarHeader;
