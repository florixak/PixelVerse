import { type SchemaTypeDefinition } from "sanity";
import { postSchema } from "./postSchema";
import { userSchema } from "./userSchema";
import { topicSchema } from "./topicSchema";
import { commentSchema } from "./commentSchema";
import { reactionSchema } from "./reactionSchema";
import { reportSchema } from "./reportSchema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userSchema,
    postSchema,
    commentSchema,
    topicSchema,
    reactionSchema,
    reportSchema,
  ],
};
