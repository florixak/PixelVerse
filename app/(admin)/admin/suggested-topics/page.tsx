import AdminSuggestedTopicsClient from "@/components/admin/admin-suggested-topics-client";
import { getAllSuggestedTopics } from "@/sanity/lib/suggested-topics/getAllSugestedTopic";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";

const AdminSuggestedTopicsPage = async () => {
  const topics = await getAllSuggestedTopics();
  const user = await currentUser();

  if (!user) {
    return <div>You must be logged in to view this page.</div>;
  }

  const sanityUser = await getUserByClerkId(user.id);

  return (
    <section>
      <AdminSuggestedTopicsClient initialTopics={topics} user={sanityUser} />
    </section>
  );
};

export default AdminSuggestedTopicsPage;
