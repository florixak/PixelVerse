import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn("border rounded-lg p-4 overflow-hidden", className)}>
      {children}
    </div>
  );
};

export default Card;
