"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Clock, Eye, XCircle } from "lucide-react";
import Link from "next/link";

export type TopicSuggestionResultData = {
  status: "rejected" | "needs_human_review";
  id?: string;
  title?: string;
  reasons?: string[];
  suggestions?: string[];
};

type TopicSuggestionResultProps = {
  result: TopicSuggestionResultData;
  onSuggestAnother?: () => void;
};

const TopicSuggestionResult = ({
  result,
  onSuggestAnother,
}: TopicSuggestionResultProps) => {
  const { status, title, reasons, suggestions } = result;

  if (status === "rejected") {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Topic suggestion declined</AlertTitle>
          <AlertDescription>
            {title && (
              <p className="font-medium text-foreground break-words">{title}</p>
            )}
            <p>
              This topic was not approved for the PixelVerse community. You can
              edit your suggestion below and try again.
            </p>
            {reasons && reasons.length > 0 && (
              <ul className="mt-2 space-y-1">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>

        {suggestions && suggestions.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Suggestions for improvement</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-xl">Suggestion submitted</CardTitle>
          <Badge variant="secondary" className="text-xs">
            <span className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              Needs human review
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {title && (
          <p className="text-sm font-medium break-words">{title}</p>
        )}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            A moderator will review your topic suggestion. It may be published
            or declined once reviewed.
          </p>
        </div>

        {reasons && reasons.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium">Notes</h3>
            <ul className="space-y-1">
              {reasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/topics">Browse topics</Link>
        </Button>
        {onSuggestAnother && (
          <Button type="button" onClick={onSuggestAnother}>
            Suggest another
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TopicSuggestionResult;
