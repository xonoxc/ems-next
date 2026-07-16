import { db } from "@/lib/db"
import { employees } from "@/server/db/schema"
import { attempt } from "@/lib/errors"
import { eq, sql } from "drizzle-orm"
import { type Result } from "neverthrow"

export type RepositoryError = { status: number; message: string }

function repoErr(message: string, status = 500): RepositoryError {
   return { status, message }
}

export interface OrgTreeNode {
   id: string
   firstName: string
   lastName: string
   designation: string
   department: string
   profileImage: string | null
   managerId: string | null
   children: OrgTreeNode[]
}

function buildTree(flat: Record<string, unknown>[]): OrgTreeNode[] {
   const nodeMap = new Map<string, OrgTreeNode & { managerId: string | null }>()
   const roots: OrgTreeNode[] = []

   for (const row of flat) {
      nodeMap.set(row.id as string, {
         id: row.id as string,
         firstName: row.firstName as string,
         lastName: row.lastName as string,
         designation: row.designation as string,
         department: row.department as string,
         profileImage: row.profileImage as string | null,
         managerId: row.managerId as string | null,
         children: [],
      })
   }

   for (const node of nodeMap.values()) {
      if (node.managerId && nodeMap.has(node.managerId)) {
         nodeMap.get(node.managerId)!.children.push(node)
      } else {
         roots.push(node)
      }
   }

   return roots
}

export const OrganizationRepository = {
   async getOrgTree(): Promise<Result<OrgTreeNode[], RepositoryError>> {
      const result = await attempt(
         db.execute<Record<string, unknown>>(sql`
            WITH RECURSIVE org_tree AS (
               SELECT
                  e.id,
                  e."firstName",
                  e."lastName",
                  e.designation,
                  e.department,
                  e."profileImage",
                  e."managerId",
                  0 AS depth,
                  ARRAY[e.id::text] AS path
               FROM employees e
               WHERE e."managerId" IS NULL
                  AND e."deletedAt" IS NULL

               UNION ALL

               SELECT
                  e.id,
                  e."firstName",
                  e."lastName",
                  e.designation,
                  e.department,
                  e."profileImage",
                  e."managerId",
                  ot.depth + 1,
                  ot.path || e.id::text
               FROM employees e
               INNER JOIN org_tree ot ON e."managerId" = ot.id
               WHERE e."deletedAt" IS NULL
                  AND NOT (e.id::text = ANY(ot.path))
                  AND ot.depth < 10
            )
            SELECT * FROM org_tree ORDER BY "firstName"
         `)
      )

      return result
         .map(res => {
            const rows = Array.isArray(res)
               ? res
               : ((res as unknown as { rows: Record<string, unknown>[] }).rows ?? [])
            return buildTree(rows)
         })
         .mapErr(() => repoErr("Failed to fetch organization tree"))
   },

   async wouldCreateCycle(
      employeeId: string,
      candidateManagerId: string
   ): Promise<Result<boolean, RepositoryError>> {
      const result = await attempt(
         db.execute<Record<string, unknown>>(sql`
            WITH RECURSIVE descendants AS (
               SELECT id
               FROM employees
               WHERE id = ${candidateManagerId}
                  AND "deletedAt" IS NULL

               UNION ALL

               SELECT e.id
               FROM employees e
               INNER JOIN descendants d ON e."managerId" = d.id
               WHERE e."deletedAt" IS NULL
            )
            SELECT EXISTS(
               SELECT 1 FROM descendants WHERE id = ${employeeId}
            ) AS is_cycle
         `)
      )

      return result
         .map(res => {
            const rows = Array.isArray(res)
               ? res
               : ((res as unknown as { rows: Record<string, unknown>[] }).rows ?? [])
            const row = rows[0] as { is_cycle: boolean } | undefined
            return row?.is_cycle ?? false
         })
         .mapErr(() => repoErr("Failed to check for cycles"))
   },

   async getDirectReports(managerId: string): Promise<Result<OrgTreeNode[], RepositoryError>> {
      const result = await attempt(
         db.query.employees.findMany({
            where: eq(employees.managerId, managerId),
         })
      )

      return result
         .map(emps =>
            emps.map(e => ({
               id: e.id,
               firstName: e.firstName,
               lastName: e.lastName,
               designation: e.designation,
               department: e.department,
               profileImage: e.profileImage,
               managerId: e.managerId,
               children: [],
            }))
         )
         .mapErr(() => repoErr("Database error"))
   },
}
