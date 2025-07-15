import AdminUsersClient from "@/components/admin/admin-users-client";
import getAllUsers from "@/sanity/lib/users/getAllUsers";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";

const AdminUsersPage = async () => {
  const users = await getAllUsers({ withBanned: true });
  const user = await currentUser();
  if (!user) {
    return <div>You must be logged in to view this page.</div>;
  }
  const sanityUser = await getUserByClerkId(user.id);
  return (
    <section>
      <AdminUsersClient initialUsers={users} user={sanityUser} />
    </section>
  );
};

export default AdminUsersPage;
