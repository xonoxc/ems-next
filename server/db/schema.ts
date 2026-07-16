import {
   boolean,
   jsonb,
   numeric,
   pgTable,
   text,
   timestamp,
   uniqueIndex,
   uuid,
   varchar,
} from "drizzle-orm/pg-core"
import { index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { softDeletedAt } from "./schema/utils"

export const users = pgTable("users", {
   id: uuid("id").primaryKey().defaultRandom(),
   name: text("name").notNull(),
   email: text("email").notNull().unique(),
   emailVerified: boolean("emailVerified").notNull().default(false),
   image: text("image"),
   role: text("role").notNull().default("employee"),
   createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
   updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const sessions = pgTable("sessions", {
   id: uuid("id").primaryKey().defaultRandom(),
   userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
   token: text("token").notNull().unique(),
   expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
   ipAddress: text("ipAddress"),
   userAgent: text("userAgent"),
   createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
   updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const accounts = pgTable("accounts", {
   id: uuid("id").primaryKey().defaultRandom(),
   userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
   accountId: text("accountId").notNull(),
   providerId: text("providerId").notNull(),
   accessToken: text("accessToken"),
   refreshToken: text("refreshToken"),
   accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { withTimezone: true }),
   refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { withTimezone: true }),
   scope: text("scope"),
   idToken: text("idToken"),
   password: text("password"),
   createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
   updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const verifications = pgTable("verifications", {
   id: uuid("id").primaryKey().defaultRandom(),
   identifier: text("identifier").notNull(),
   value: text("value").notNull(),
   expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
   createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
   updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const employees = pgTable(
   "employees",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      userId: uuid("userId").references(() => users.id, { onDelete: "set null" }),
      employeeId: varchar("employeeId", { length: 20 }).notNull().unique(),
      firstName: varchar("firstName", { length: 100 }).notNull(),
      lastName: varchar("lastName", { length: 100 }).notNull(),
      email: text("email").notNull().unique(),
      phone: varchar("phone", { length: 20 }),
      department: varchar("department", { length: 100 }).notNull(),
      designation: varchar("designation", { length: 100 }).notNull(),
      salary: numeric("salary", { precision: 12, scale: 2 }).notNull(),
      joiningDate: timestamp("joiningDate", { withTimezone: true }).notNull(),
      status: varchar("status", { length: 20 }).notNull().default("active"),
      managerId: uuid("managerId"),
      profileImage: text("profileImage"),
      createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
      updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
      deletedAt: softDeletedAt,
   },
   table => [
      index("employees_manager_id_idx").on(table.managerId),
      index("employees_department_idx").on(table.department),
      index("employees_email_idx").on(table.email),
      uniqueIndex("employees_employee_id_idx").on(table.employeeId),
      index("employees_not_deleted_idx").on(table.deletedAt),
   ]
)

export const auditLogs = pgTable(
   "auditLogs",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      actorId: uuid("actorId")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      action: varchar("action", { length: 50 }).notNull(),
      entityType: varchar("entityType", { length: 50 }).notNull(),
      entityId: uuid("entityId").notNull(),
      metadata: jsonb("metadata"),
      createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
   },
   table => [
      index("audit_logs_entity_id_idx").on(table.entityId),
      index("audit_logs_actor_id_idx").on(table.actorId),
      index("audit_logs_created_at_idx").on(table.createdAt),
   ]
)

export const usersRelations = relations(users, ({ many }) => ({
   sessions: many(sessions),
   accounts: many(accounts),
   employees: many(employees),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
   user: one(users, {
      fields: [sessions.userId],
      references: [users.id],
   }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
   user: one(users, {
      fields: [accounts.userId],
      references: [users.id],
   }),
}))

export const employeesRelations = relations(employees, ({ one, many }) => ({
   user: one(users, {
      fields: [employees.userId],
      references: [users.id],
   }),
   manager: one(employees, {
      fields: [employees.managerId],
      references: [employees.id],
      relationName: "employee_manager",
   }),
   directReports: many(employees, { relationName: "employee_manager" }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
   actor: one(users, {
      fields: [auditLogs.actorId],
      references: [users.id],
   }),
}))
