import { timestamp } from "drizzle-orm/pg-core"

export const softDeletedAt = timestamp("deletedAt")
