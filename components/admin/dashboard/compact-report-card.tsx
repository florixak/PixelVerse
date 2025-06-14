import { Report } from "@/sanity.types";

import Link from "next/link";
import { MessageSquare, FileText, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

type CompactReportCardProps = {
  report: Report;
};

const CompactReportCard = ({ report }: CompactReportCardProps) => {
  const contentTypeIcon = {
    post: <FileText className="h-3.5 w-3.5" />,
    comment: <MessageSquare className="h-3.5 w-3.5" />,
    user: <User className="h-3.5 w-3.5" />,
  }[report.reportedContent?._type as string] || (
    <FileText className="h-3.5 w-3.5" />
  );

  const statusColor =
    {
      pending: "bg-yellow-500",
      resolved: "bg-green-500",
      rejected: "bg-red-500",
    }[report.status] || "bg-gray-500";

  return (
    <Link
      href={`/admin/reports/${report._id}`}
      className="block border rounded-md hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center p-2.5">
        <div className={`w-1.5 h-1.5 rounded-full ${statusColor} mr-2.5`} />

        <div className="p-1 bg-muted rounded-md mr-2.5">{contentTypeIcon}</div>

        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
            <p className="text-xs font-medium truncate">
              #{report.displayId} •{" "}
              <span className="capitalize">{report.reason}</span>
            </p>
            <p className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
              {formatDate(report.reportedAt)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Reported {report.contentType || "Unknown"} by{" "}
            {report.reporter?.username || "Anonymous"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CompactReportCard;
