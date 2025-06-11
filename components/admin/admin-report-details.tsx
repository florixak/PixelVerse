// components/admin/admin-report-details.tsx
import { Report } from "@/sanity.types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

type AdminReportDetailsProps = {
  report: Report;
};

const AdminReportDetails = ({ report }: AdminReportDetailsProps) => {
  const reportedAt = new Date(report.reportedAt);
  const contentType = report.post ? "Post" : "Comment";
  const reportedContent = report.post || report.comment;
  const reportAuthor = reportedContent?.author;

  const statusConfig: {
    variant: "outline" | "default" | "destructive";
    icon: React.ReactNode;
    label: string;
  } = {
    pending: {
      variant: "outline" as const,
      icon: <Clock className="h-4 w-4 mr-1" />,
      label: "Pending Review",
    },
    resolved: {
      variant: "default" as const,
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      label: "Resolved",
    },
    rejected: {
      variant: "destructive" as const,
      icon: <XCircle className="h-4 w-4 mr-1" />,
      label: "Rejected",
    },
  }[report.status] || { variant: "default", icon: null, label: report.status };

  return (
    <div className="space-y-6">
      {/* Header with key information */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Report #{report.displayId}
            <Badge variant={statusConfig.variant} className="ml-2 text-xs">
              <span className="flex items-center">
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            {/*Filed {formatDistanceToNow(reportedAt, { addSuffix: true })}*/}
          </p>
        </div>

        {/* Additional navigation options could go here */}
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Left column - Report information */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Reason
                </h3>
                <p className="font-medium">{report.reason}</p>
              </div>

              {report.additionalInfo && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Additional Information
                  </h3>
                  <p>{report.additionalInfo}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Reported By
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={report.reporter?.imageUrl} />
                    <AvatarFallback>
                      {report.reporter?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{report.reporter?.username}</span>
                </div>
              </div>

              {report.moderatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Moderation Details
                  </h3>
                  <div className="space-y-1">
                    <p>
                      Moderated{" "}
                      {/*formatDistanceToNow(new Date(report.moderatedAt), {
                        addSuffix: true,
                      })*/}
                    </p>
                    {report.moderatedBy && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={report.moderatedBy?.imageUrl} />
                          <AvatarFallback>
                            {report.moderatedBy?.username
                              ?.substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>By {report.moderatedBy?.username}</span>
                      </div>
                    )}
                    {report.moderationNotes && (
                      <p className="text-sm mt-2 italic">
                        "{report.moderationNotes}"
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Reported content */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Reported {contentType}</span>
                {report.post && (
                  <Link
                    href={`/topics/${report.post.topicSlug}/${report.post.slug}`}
                    className="text-sm flex items-center text-primary"
                    target="_blank"
                  >
                    View Post <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                )}
                {report.comment && (
                  <Link
                    href={`/topics/${report.comment.post?.slug}#comment-${report.comment._id}`}
                    className="text-sm flex items-center text-primary"
                    target="_blank"
                  >
                    View Comment <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author information */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={reportAuthor?.imageUrl} />
                  <AvatarFallback>
                    {reportAuthor?.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{reportAuthor?.username}</div>
                  <div className="text-sm text-muted-foreground">
                    Posted{" "}
                    {/*formatDistanceToNow(
                      new Date(reportedContent?.publishedAt || reportedAt),
                      { addSuffix: true }
                    )*/}
                  </div>
                </div>
              </div>

              {/* Content preview */}
              <div className="p-4 border rounded-md bg-muted/50">
                {report.post && (
                  <>
                    <h3 className="font-bold text-lg mb-2">
                      {report.post.title}
                    </h3>
                    <div className="prose prose-sm max-w-none"></div>
                  </>
                )}

                {report.comment && (
                  <div className="prose prose-sm max-w-none">
                    {report.comment.content}
                  </div>
                )}
              </div>

              {/* Contextual information */}
              {report.comment && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Comment Context</AlertTitle>
                  <AlertDescription>
                    This comment was made on the post "
                    {report.comment?.post?.title}"
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Moderation action form would go below this */}
    </div>
  );
};

export default AdminReportDetails;
