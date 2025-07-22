import React from "react";
import AdminTablePagination from "./admin-table-pagination";
import { Report } from "@/sanity.types";
import { Table } from "@tanstack/react-table";

type AdminReportsTablePaginationProps = {
  table: Table<Report>;
};

const AdminReportsTablePagination = ({
  table,
}: AdminReportsTablePaginationProps) => {
  return <AdminTablePagination table={table} />;
};

export default AdminReportsTablePagination;
