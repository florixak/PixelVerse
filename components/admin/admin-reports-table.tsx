"use client";

import {
  createColumnHelper,
  flexRender,
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
  User as UserType,
  isPostContent,
  isCommentContent,
  isUserContent,
} from "@/sanity.types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

type AdminReportsTableProps = {
  initialReports: Report[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  currentUser: UserType | null;
};

const columnHelper = createColumnHelper<Report>();

const AdminReportsTable = ({
  initialReports,
  globalFilter,
  setGlobalFilter,
  currentUser,
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
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
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
      (row) => {
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
            href = `/profile/${content.username}`;
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

            {isPending && (
              <>
                <Button
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleReportAction(report._id, "resolved")}
                >
                  Resolve
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReportAction(report._id, "rejected")}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        );
      },
    }),
  ];

  const handleReportAction = async (
    reportId: string,
    status: "resolved" | "rejected"
  ) => {
    // Here you would call your server action to update the report status
    console.log(`Updating report ${reportId} to ${status}`);
    // Implement the actual action call
  };

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

  return (
    <>
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminReportsTable;
