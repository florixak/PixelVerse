import { SuggestedTopic } from "@/sanity.types";
import {
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Bot,
  Calendar,
  User,
  Hash,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getSuggestedTopicById } from "@/sanity/lib/suggested-topics/getSuggestedTopicById";
import { notFound } from "next/navigation";
import AdminSuggestTopicButtons from "@/components/admin/admin-suggest-topic-buttons";

type SuggestedTopicDetailsProps = {
  params: Promise<{ id: SuggestedTopic["_id"] }>;
};

export function getTopicStatus(topic: SuggestedTopic): {
  variant: "outline" | "default" | "destructive" | "secondary";
  icon: React.ReactNode;
  label: string;
  emoji: string;
} {
  const statusMap = {
    pending_ai: {
      variant: "outline" as const,
      icon: <Clock className="h-4 w-4 mr-1" />,
      label: "Pending AI Review",
      emoji: "⏳",
    },
    ai_approved: {
      variant: "default" as const,
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      label: "AI Approved",
      emoji: "✅",
    },
    ai_rejected: {
      variant: "destructive" as const,
      icon: <XCircle className="h-4 w-4 mr-1" />,
      label: "AI Rejected",
      emoji: "❌",
    },
    needs_human_review: {
      variant: "secondary" as const,
      icon: <Eye className="h-4 w-4 mr-1" />,
      label: "Needs Human Review",
      emoji: "👁️",
    },
    manually_approved: {
      variant: "default" as const,
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      label: "Manually Approved",
      emoji: "✅",
    },
    rejected: {
      variant: "destructive" as const,
      icon: <XCircle className="h-4 w-4 mr-1" />,
      label: "Rejected",
      emoji: "🚫",
    },
    published: {
      variant: "default" as const,
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      label: "Published",
      emoji: "🚀",
    },
  };

  return (
    statusMap[topic.status as keyof typeof statusMap] || {
      variant: "outline",
      icon: <Clock className="h-4 w-4 mr-1" />,
      label: "Unknown",
      emoji: "❓",
    }
  );
}

const SuggestedTopicDetails = async ({
  params,
}: SuggestedTopicDetailsProps) => {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const topic = await getSuggestedTopicById(id);
  if (!topic) {
    notFound();
  }

  const submittedAt = topic.submittedAt ? new Date(topic.submittedAt) : null;
  const moderatedAt = topic.moderatedAt ? new Date(topic.moderatedAt) : null;
  const statusConfig = getTopicStatus(topic);

  const getSuitabilityColor = (score: number): string => {
    if (score >= 0.7) return "text-green-600";
    if (score >= 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  const getSuitabilityBadge = (score: number) => {
    const percentage = Math.round(score * 100);
    const variant =
      score >= 0.7 ? "default" : score >= 0.4 ? "secondary" : "destructive";
    return (
      <Badge variant={variant} className="font-mono">
        {percentage}%
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 items-center">
        <div className="flex items-start gap-4">
          {topic.iconUrl && (
            <div className="flex-shrink-0">
              <Image
                src={topic.iconUrl}
                alt={topic.title || "Topic icon"}
                width={64}
                height={64}
                className="rounded-lg border shadow-sm"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold break-words">
              {statusConfig.emoji} {topic.title}
            </h1>
            {topic.slug && (
              <p className="text-muted-foreground font-mono text-sm">
                /{topic.slug}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={statusConfig.variant} className="text-xs">
                <span className="flex items-center">
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </Badge>
              {topic.aiModerationResult?.suitabilityScore !== undefined &&
                getSuitabilityBadge(topic.aiModerationResult.suitabilityScore)}
            </div>
            {submittedAt && (
              <p className="text-muted-foreground text-sm mt-1">
                Submitted {formatDate(submittedAt)}
              </p>
            )}
          </div>
        </div>

        <AdminSuggestTopicButtons topic={topic} />
      </div>

      {topic.bannerUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Topic Banner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={topic.bannerUrl}
              alt={`${topic.title} banner`}
              width={800}
              height={400}
              className="object-cover"
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Topic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topic.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed">{topic.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Submitted By
                </h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={topic.submittedBy?.imageUrl} />
                    <AvatarFallback>
                      {topic.submittedBy?.username
                        ?.substring(0, 2)
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {topic.submittedBy?.username ? (
                    <Link
                      href={`/user/${topic.submittedBy.username}`}
                      className="text-primary hover:underline"
                    >
                      @{topic.submittedBy.username}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Unknown user</span>
                  )}
                </div>
              </div>

              {topic.slug && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    <Hash className="h-4 w-4 inline mr-1" />
                    URL Slug
                  </h3>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    /{topic.slug}
                  </code>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Timestamps
                </h3>
                <div className="space-y-1 text-sm">
                  {submittedAt && <p>Submitted: {formatDate(submittedAt)}</p>}
                  {topic.aiModerationResult?.checkedAt && (
                    <p>
                      AI Check: {formatDate(topic.aiModerationResult.checkedAt)}
                    </p>
                  )}
                </div>
              </div>

              {(moderatedAt || topic.moderatedBy || topic.adminNotes) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Moderation Details
                  </h3>
                  <div className="space-y-2">
                    {moderatedAt && (
                      <p className="text-sm">
                        Moderated {formatDate(moderatedAt)}
                      </p>
                    )}
                    {topic.moderatedBy && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={topic.moderatedBy.imageUrl} />
                          <AvatarFallback className="text-xs">
                            {topic.moderatedBy.username
                              ?.substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          By {topic.moderatedBy.username}
                        </span>
                      </div>
                    )}
                    {topic.adminNotes && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <p className="font-medium mb-1">Admin Notes:</p>
                        <p className="italic">"{topic.adminNotes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-4">
          {topic.aiModerationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Moderation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Score Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      <span
                        className={getSuitabilityColor(
                          topic.aiModerationResult.suitabilityScore || 0
                        )}
                      >
                        {Math.round(
                          (topic.aiModerationResult.suitabilityScore || 0) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Suitability
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">
                      {topic.aiModerationResult.isApproved ? "✅" : "❌"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {topic.aiModerationResult.isApproved
                        ? "Approved"
                        : "Rejected"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (topic.aiModerationResult.confidence || 0) * 100
                      )}
                      %
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {topic.aiModerationResult.categories &&
                  topic.aiModerationResult.categories.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Detected Categories
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {topic.aiModerationResult.categories.map(
                          (category, index) => (
                            <Badge
                              key={index}
                              variant={
                                category === "inappropriate" ||
                                category === "off_topic"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {category.replace("_", " ")}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* AI Reasoning */}
                {topic.aiModerationResult.reasons &&
                  topic.aiModerationResult.reasons.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        AI Reasoning
                      </h5>
                      <div className="space-y-2">
                        {topic.aiModerationResult.reasons.map(
                          (reason, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                              <span>{reason}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* AI Suggestions */}
                {topic.aiModerationResult.suggestions &&
                  topic.aiModerationResult.suggestions.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>AI Suggestions for Improvement</AlertTitle>
                      <AlertDescription>
                        <ul className="mt-2 space-y-1">
                          {topic.aiModerationResult.suggestions.map(
                            (suggestion, index) => (
                              <li
                                key={index}
                                className="text-sm flex items-start gap-2"
                              >
                                <span className="text-blue-500">•</span>
                                {suggestion}
                              </li>
                            )
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                {/* AI Check Details */}
                <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded border">
                  <p>
                    <strong>AI Analysis completed:</strong>{" "}
                    {topic.aiModerationResult.checkedAt
                      ? formatDate(topic.aiModerationResult.checkedAt)
                      : "Unknown"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status-specific alerts */}
          {topic.status === "needs_human_review" && (
            <Alert>
              <Eye className="h-4 w-4" />
              <AlertTitle>Human Review Required</AlertTitle>
              <AlertDescription>
                This topic suggestion requires manual review from a moderator.
                The AI was uncertain about its suitability for the community.
              </AlertDescription>
            </Alert>
          )}

          {topic.status === "ai_rejected" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>AI Rejected</AlertTitle>
              <AlertDescription>
                This topic was automatically rejected by AI moderation. Check
                the AI analysis above for specific reasons.
              </AlertDescription>
            </Alert>
          )}

          {topic.status === "published" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Topic Published</AlertTitle>
              <AlertDescription>
                This topic has been approved and is now live on the platform.
                Users can create posts under this topic.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestedTopicDetails;
