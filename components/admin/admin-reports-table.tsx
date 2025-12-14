"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Eye, FileText, MessageSquare, User } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Report,
  isPostContent,
  isCommentContent,
  isUserContent,
} from "@/sanity.types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import Table from "../ui/table";

type AdminReportsTableProps = {
  initialReports: Report[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
};

const columnHelper = createColumnHelper<Report>();

const AdminReportsTable = ({
  initialReports,
  globalFilter,
  setGlobalFilter,
}: AdminReportsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const columns = [
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Status
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge
            variant={
              status === "pending"
                ? "outline"
                : status === "resolved"
                ? "default"
                : "destructive"
            }
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    }),

    // Reason Column
    columnHelper.accessor("reason", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Reason
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <span className="capitalize">{info.getValue().replace("_", " ")}</span>
      ),
    }),

    // Content Type Column
    columnHelper.accessor("contentType", {
      header: "Content Type",
      cell: (info) => {
        const type = info.getValue();
        let icon;

        switch (type) {
          case "post":
            icon = <FileText className="h-4 w-4 mr-1" />;
            break;
          case "comment":
            icon = <MessageSquare className="h-4 w-4 mr-1" />;
            break;
          case "user":
            icon = <User className="h-4 w-4 mr-1" />;
            break;
          default:
            icon = null;
        }

        return (
          <div className="flex items-center">
            {icon}
            <span className="capitalize">{type}</span>
          </div>
        );
      },
    }),

    // Content Title/Excerpt Column
    columnHelper.accessor(
      (row: Report) => {
        const content = row.reportedContent;
        if (!content) return "Content unavailable";

        if (isPostContent(content)) {
          return content.title;
        } else if (isCommentContent(content)) {
          return `Comment: ${content.content?.substring(0, 30)}...`;
        } else if (isUserContent(content)) {
          return `User: ${content.username}`;
        }
        return "Unknown content";
      },
      {
        id: "contentTitle",
        header: "Content",
        cell: (info) => {
          const report = info.row.original;
          const content = report.reportedContent;
          const title = info.getValue();

          if (!content) {
            return (
              <span className="text-muted-foreground italic">
                Content unavailable
              </span>
            );
          }

          let href = "#";
          if (isPostContent(content)) {
            href = `/topics/${content.topicSlug}/${content.slug}`;
          } else if (isCommentContent(content)) {
            href = `/topics/${content.post?.topicSlug}/${content.post?.slug}#comment-${content._id}`;
          } else if (isUserContent(content)) {
            href = `/user/${content.username}`;
          }

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className="text-primary hover:underline truncate block max-w-[200px]"
                >
                  {title}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                Click to view reported content
              </TooltipContent>
            </Tooltip>
          );
        },
      }
    ),

    // Reporter Column
    columnHelper.accessor("reporter.username", {
      header: "Reporter",
      cell: (info) => {
        const username = info.getValue();
        return username ? (
          <Link href={`/profile/${username}`} className="hover:underline">
            {username}
          </Link>
        ) : (
          "Anonymous"
        );
      },
    }),

    // Reported At Column
    columnHelper.accessor("reportedAt", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Reported At
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const value = info.getValue();
        return (
          <span className="text-sm text-muted-foreground">
            {value ? formatDate(value) : "N/A"}
          </span>
        );
      },
    }),

    // Actions Column
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const report = info.row.original;
        const isPending = report.status === "pending";

        return (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/reports/${report._id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: initialReports,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: "reportedAt",
          desc: true,
        },
      ],
    },
  });

  return <Table table={table} columnsLength={columns.length} />;
};

export default AdminReportsTable;
