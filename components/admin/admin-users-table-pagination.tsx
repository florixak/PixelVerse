import { Table } from "@tanstack/react-table";
import { User } from "@/sanity.types";
import AdminTablePagination from "./admin-table-pagination";

type AdminUsersTablePaginationProps = {
  table: Table<User>;
};

const AdminUsersTablePagination = ({
  table,
}: AdminUsersTablePaginationProps) => {
  return <AdminTablePagination table={table} />;
};

export default AdminUsersTablePagination;
