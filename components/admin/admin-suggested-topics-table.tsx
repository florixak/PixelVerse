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
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { SuggestedTopic, User } from "@/sanity.types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import Table from "../table";
import { Status } from "@/types/suggested-topics";
import { getStatusVariant, getStatusEmoji } from "@/lib/post-utils";

type AdminSuggestedTopicsTableProps = {
  initialTopics: SuggestedTopic[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  user: User | null;
};

const columnHelper = createColumnHelper<SuggestedTopic>();

const AdminSuggestedTopicsTable = ({
  initialTopics,
  globalFilter,
  setGlobalFilter,
  user,
}: AdminSuggestedTopicsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Title
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-3">
          {info.row.original.iconUrl && (
            <img
              src={info.row.original.iconUrl || ""}
              alt={info.getValue()}
              width={32}
              height={32}
              className="rounded-md"
            />
          )}
          <div>
            <span className="font-medium">{info.getValue()}</span>
            {info.row.original.slug?.current && (
              <p className="text-xs text-muted-foreground">
                /{info.row.original.slug.current}
              </p>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <Tooltip>
          <TooltipTrigger>
            <span className="text-sm text-muted-foreground line-clamp-2 max-w-[200px]">
              {info.getValue() || "No description"}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="max-w-xs break-words">
              {info.getValue() || "No description provided"}
            </span>
          </TooltipContent>
        </Tooltip>
      ),
    }),
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
      cell: (info) => (
        <Badge variant={getStatusVariant(info.getValue() as Status)}>
          {getStatusEmoji(info.getValue())}{" "}
          {(info.getValue() as Status).replace("_", " ")}
        </Badge>
      ),
    }),
    columnHelper.accessor("aiModerationResult.suitabilityScore", {
      header: "AI Score",
      cell: (info) => {
        const score = info.getValue();
        if (score === undefined || score === null) return "N/A";
        const percentage = Math.round(score * 100);
        return (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                percentage >= 70
                  ? "text-green-600"
                  : percentage >= 40
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {percentage}%
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("submittedBy", {
      header: "Submitted By",
      cell: (info) => {
        const submitter = info.getValue();
        return submitter?.username ? (
          <Link
            href={`/user/${submitter.username}`}
            className="text-blue-600 hover:underline"
          >
            @{submitter.username}
          </Link>
        ) : (
          <span className="text-muted-foreground">Unknown</span>
        );
      },
    }),
    columnHelper.accessor("submittedAt", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Submitted
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
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/suggested-topics/${info.row.original._id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Details</TooltipContent>
          </Tooltip>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: initialTopics,
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
    },
  });

  return <Table table={table} columnsLength={columns.length} />;
};

export default AdminSuggestedTopicsTable;
