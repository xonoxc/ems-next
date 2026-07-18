import {
   createSearchParamsCache,
   parseAsString,
   parseAsInteger,
   parseAsStringEnum,
} from "nuqs/server"

export const searchParamsCache = createSearchParamsCache({
   search: parseAsString.withDefault(""),
   page: parseAsInteger.withDefault(1),
   pageSize: parseAsInteger.withDefault(10),
   sortBy: parseAsString.withDefault("createdAt"),
   sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
   department: parseAsString.withDefault(""),
   status: parseAsString.withDefault(""),
   role: parseAsString.withDefault(""),
})
