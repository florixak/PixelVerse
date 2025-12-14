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
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import AdminRoleSelect from "./admin-role-select";
import { useState } from "react";
import { User } from "@/sanity.types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AdminModifyButtons from "./admin-modify-buttons";
import Table from "../ui/table";

type AdminUsersTableProps = {
  initialUsers: User[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  user: User | null;
};

const columnHelper = createColumnHelper<User>();

const AdminUsersTable = ({
  initialUsers,
  globalFilter,
  setGlobalFilter,
  user,
}: AdminUsersTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const modColumns = [
    columnHelper.accessor("username", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Username
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={`/user/${info.row.original.username}`}
                className="hover:underline"
              >
                <span className="font-medium">{info.getValue()}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <span className="max-w-xs break-words">
                Click to view profile
              </span>
            </TooltipContent>
          </Tooltip>
        </>
      ),
    }),
    columnHelper.accessor("fullName", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Full Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {info.getValue() || "N/A"}
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <AdminRoleSelect
          defaultRole={info.getValue() as User["role"]}
          targetUser={info.row.original}
          currentUser={user}
        />
      ),
    }),
    columnHelper.accessor(
      (row) =>
        row.isBanned ? "Banned" : row.isReported ? "Reported" : "Active",
      {
        id: "status",
        header: "Status",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded text-xs ${
              info.getValue() === "Banned"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                : info.getValue() === "Reported"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {info.getValue()}
          </span>
        ),
      }
    ),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 m-0 h-auto font-bold"
        >
          Created At
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
  ];

  const adminColumns = [
    ...modColumns,
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const targetUser = info.row.original;
        return (
          <AdminModifyButtons currentUser={user} targetUser={targetUser} />
        );
      },
    }),
  ];

  const columns = user?.role === "admin" ? adminColumns : modColumns;

  const table = useReactTable({
    data: initialUsers,
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

export default AdminUsersTable;
