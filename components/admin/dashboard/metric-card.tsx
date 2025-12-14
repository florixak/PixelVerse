import BasicCard from "@/components/basic-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

type MetricCardProps = {
  title: string;
  value: string | number | null | undefined;
  change?: string | number | null | undefined;
  subtext?: string;
  icon: React.ReactNode;
  href?: string;
};

const MetricCard = ({
  title,
  value,
  change,
  subtext,
  icon,
  href,
}: MetricCardProps) => (
  <BasicCard
    className={`${href ? "transition-all hover:border-primary/50" : ""} ${
      href ? "relative" : ""
    }`}
    key={title}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
      {typeof change !== "undefined" && (
        <p
          className={`text-sm ${
            Number(change) >= 0
              ? Number(change) === 0
                ? "text-muted-foreground"
                : "text-green-500"
              : "text-red-500"
          }`}
        >
          {Number(change) >= 0 ? "+" : ""}
          {change} in the last 24 hours
        </p>
      )}
    </CardContent>
    {href && (
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={`View ${title}`}
      />
    )}
  </BasicCard>
);

export default MetricCard;
