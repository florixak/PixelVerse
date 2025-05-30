import { type SchemaTypeDefinition } from "sanity";
import { postSchema } from "./postSchema";
import { userSchema } from "./userSchema";
import { topicSchema } from "./topicSchema";
import { commentSchema } from "./commentSchema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userSchema, postSchema, commentSchema, topicSchema],
};
