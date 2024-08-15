"use server";

import { revalidateTag } from "next/cache";

/** TODO: replace this with server actions for item CRUD */
export const revalidateServerTag = (tag: string) => {
  revalidateTag(tag);
};
