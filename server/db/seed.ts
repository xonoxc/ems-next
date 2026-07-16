import { eq } from "drizzle-orm"
import { hash } from "bcryptjs"
import { db } from "../../lib/db"
import { users, employees, accounts, auditLogs } from "../db/schema"

const departments = ["Engineering", "Marketing", "Sales", "Finance", "HR", "Operations"] as const

type Department = (typeof departments)[number]

const designations: Record<Department, string[]> = {
   Engineering: [
      "Software Engineer",
      "Senior Software Engineer",
      "Tech Lead",
      "Engineering Manager",
      "VP of Engineering",
      "Director of Engineering",
   ],
   Marketing: [
      "Marketing Coordinator",
      "Marketing Specialist",
      "Marketing Manager",
      "Director of Marketing",
      "VP of Marketing",
   ],
   Sales: [
      "Sales Representative",
      "Senior Sales Rep",
      "Sales Manager",
      "Director of Sales",
      "VP of Sales",
   ],
   Finance: [
      "Financial Analyst",
      "Senior Financial Analyst",
      "Finance Manager",
      "Director of Finance",
      "CFO",
   ],
   HR: ["HR Coordinator", "HR Specialist", "HR Manager", "Director of HR"],
   Operations: [
      "Operations Coordinator",
      "Operations Specialist",
      "Operations Manager",
      "Director of Operations",
      "VP of Operations",
   ],
}

function randomDate(start: Date, end: Date): Date {
   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomPick<T>(arr: readonly T[]): T {
   return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone(): string {
   return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
}

interface SeedUser {
   id?: string
   name: string
   email: string
   role: string
}

const userData: SeedUser[] = [
   { name: "Admin User", email: "admin@ems.dev", role: "super_admin" },
   { name: "HR Manager", email: "hr@ems.dev", role: "hr_manager" },
   { name: "John Employee", email: "employee@ems.dev", role: "employee" },
]

interface SeedEmployee {
   firstName: string
   lastName: string
   email: string
   department: Department
   designation: string
   salary: number
   joiningDate: Date
   status: "active" | "inactive" | "terminated"
   isManager?: boolean
   managerIndex?: number
   userId?: string
}

const firstNames = [
   "James",
   "Mary",
   "Robert",
   "Patricia",
   "John",
   "Jennifer",
   "Michael",
   "Linda",
   "David",
   "Elizabeth",
   "William",
   "Barbara",
   "Richard",
   "Susan",
   "Joseph",
   "Jessica",
   "Thomas",
   "Sarah",
   "Christopher",
   "Karen",
   "Charles",
   "Lisa",
   "Daniel",
   "Nancy",
   "Matthew",
   "Betty",
   "Anthony",
   "Margaret",
   "Mark",
   "Sandra",
   "Donald",
   "Ashley",
   "Steven",
   "Dorothy",
   "Paul",
   "Kimberly",
   "Andrew",
   "Emily",
   "Joshua",
   "Donna",
   "Kenneth",
   "Michelle",
   "Kevin",
   "Carol",
   "Brian",
   "Amanda",
   "George",
   "Melissa",
   "Timothy",
   "Deborah",
   "Ronald",
   "Stephanie",
   "Edward",
   "Rebecca",
   "Jason",
   "Sharon",
   "Jeffrey",
   "Laura",
   "Ryan",
   "Cynthia",
   "Jacob",
   "Kathleen",
   "Gary",
   "Amy",
   "Nicholas",
   "Angela",
   "Eric",
   "Shirley",
   "Jonathan",
   "Anna",
   "Stephen",
   "Brenda",
   "Larry",
   "Pamela",
   "Justin",
   "Emma",
   "Scott",
   "Nicole",
   "Brandon",
   "Helen",
   "Benjamin",
   "Samantha",
   "Samuel",
   "Katherine",
   "Raymond",
   "Christine",
   "Gregory",
   "Debra",
   "Frank",
   "Rachel",
   "Alexander",
   "Carolyn",
   "Patrick",
   "Janet",
   "Jack",
   "Catherine",
]

const lastNames = [
   "Smith",
   "Johnson",
   "Williams",
   "Brown",
   "Jones",
   "Garcia",
   "Miller",
   "Davis",
   "Rodriguez",
   "Martinez",
   "Hernandez",
   "Lopez",
   "Gonzalez",
   "Wilson",
   "Anderson",
   "Thomas",
   "Taylor",
   "Moore",
   "Jackson",
   "Martin",
   "Lee",
   "Perez",
   "Thompson",
   "White",
   "Harris",
   "Sanchez",
   "Clark",
   "Ramirez",
   "Lewis",
   "Robinson",
   "Walker",
   "Young",
   "Allen",
   "King",
   "Wright",
   "Scott",
   "Torres",
   "Nguyen",
   "Hill",
   "Flores",
   "Green",
   "Adams",
   "Nelson",
   "Baker",
   "Hall",
   "Rivera",
   "Campbell",
   "Mitchell",
   "Carter",
   "Roberts",
   "Gomez",
   "Phillips",
   "Evans",
   "Turner",
   "Diaz",
   "Parker",
   "Cruz",
   "Edwards",
   "Collins",
   "Reyes",
   "Stewart",
   "Morris",
   "Morales",
   "Murphy",
   "Cook",
   "Rogers",
   "Gutierrez",
   "Ortiz",
   "Morgan",
   "Cooper",
   "Peterson",
   "Bailey",
   "Reed",
   "Kelly",
   "Howard",
   "Ramos",
   "Kim",
   "Cox",
   "Ward",
   "Richardson",
]

function generateEmployees(): SeedEmployee[] {
   const emps: SeedEmployee[] = []

   emps.push({
      firstName: "Alexandra",
      lastName: "Chen",
      email: "alexandra.chen@ems.dev",
      department: "Operations",
      designation: "CEO",
      salary: 250000,
      joiningDate: new Date("2019-01-15"),
      status: "active",
      isManager: true,
   })

   const vpNames = [
      {
         first: "Marcus",
         last: "Johnson",
         dept: "Engineering" as Department,
         designation: "VP of Engineering",
         salary: 200000,
      },
      {
         first: "Priya",
         last: "Patel",
         dept: "Sales" as Department,
         designation: "VP of Sales",
         salary: 190000,
      },
   ]

   for (const vp of vpNames) {
      emps.push({
         firstName: vp.first,
         lastName: vp.last,
         email: `${vp.first.toLowerCase()}.${vp.last.toLowerCase()}@ems.dev`,
         department: vp.dept,
         designation: vp.designation,
         salary: vp.salary,
         joiningDate: new Date("2020-03-10"),
         status: "active",
         isManager: true,
         managerIndex: 0,
      })
   }

   const directorData = [
      {
         first: "Sarah",
         last: "Williams",
         dept: "Engineering" as Department,
         designation: "Director of Engineering",
         salary: 170000,
         vpIndex: 1,
      },
      {
         first: "David",
         last: "Brown",
         dept: "Engineering" as Department,
         designation: "Director of Engineering",
         salary: 165000,
         vpIndex: 1,
      },
      {
         first: "Laura",
         last: "Martinez",
         dept: "Marketing" as Department,
         designation: "Director of Marketing",
         salary: 160000,
         vpIndex: 2,
      },
      {
         first: "James",
         last: "Taylor",
         dept: "Sales" as Department,
         designation: "Director of Sales",
         salary: 155000,
         vpIndex: 2,
      },
   ]

   for (const d of directorData) {
      emps.push({
         firstName: d.first,
         lastName: d.last,
         email: `${d.first.toLowerCase()}.${d.last.toLowerCase()}@ems.dev`,
         department: d.dept,
         designation: d.designation,
         salary: d.salary,
         joiningDate: new Date("2021-06-20"),
         status: "active",
         isManager: true,
         managerIndex: d.vpIndex,
      })
   }

   const managerData = [
      {
         first: "Michael",
         last: "Wilson",
         dept: "Engineering" as Department,
         designation: "Engineering Manager",
         salary: 140000,
         dirIndex: 3,
      },
      {
         first: "Emily",
         last: "Davis",
         dept: "Engineering" as Department,
         designation: "Engineering Manager",
         salary: 138000,
         dirIndex: 3,
      },
      {
         first: "Robert",
         last: "Garcia",
         dept: "Engineering" as Department,
         designation: "Engineering Manager",
         salary: 135000,
         dirIndex: 4,
      },
      {
         first: "Jennifer",
         last: "Rodriguez",
         dept: "Engineering" as Department,
         designation: "Engineering Manager",
         salary: 133000,
         dirIndex: 4,
      },
      {
         first: "Thomas",
         last: "Anderson",
         dept: "Marketing" as Department,
         designation: "Marketing Manager",
         salary: 125000,
         dirIndex: 5,
      },
      {
         first: "Jessica",
         last: "Thomas",
         dept: "HR" as Department,
         designation: "HR Manager",
         salary: 120000,
         dirIndex: 5,
      },
      {
         first: "Daniel",
         last: "Jackson",
         dept: "Finance" as Department,
         designation: "Finance Manager",
         salary: 122000,
         dirIndex: 6,
      },
      {
         first: "Amanda",
         last: "White",
         dept: "Operations" as Department,
         designation: "Operations Manager",
         salary: 118000,
         dirIndex: 6,
      },
   ]

   for (const m of managerData) {
      emps.push({
         firstName: m.first,
         lastName: m.last,
         email: `${m.first.toLowerCase()}.${m.last.toLowerCase()}@ems.dev`,
         department: m.dept,
         designation: m.designation,
         salary: m.salary,
         joiningDate: new Date("2022-01-15"),
         status: "active",
         isManager: true,
         managerIndex: m.dirIndex,
      })
   }

   const usedEmails = new Set(emps.map(e => e.email))
   const statuses: ("active" | "inactive" | "terminated")[] = [
      "active",
      "active",
      "active",
      "active",
      "inactive",
      "terminated",
   ]

   for (let i = 0; i < 35; i++) {
      let firstName: string
      let lastName: string
      let email: string

      do {
         firstName = randomPick(firstNames)
         lastName = randomPick(lastNames)
         email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ems.dev`
      } while (usedEmails.has(email))

      usedEmails.add(email)

      const dept = randomPick(departments)
      const designationPool = designations[dept].filter(
         d =>
            !d.toLowerCase().includes("vp") &&
            !d.toLowerCase().includes("director") &&
            !d.toLowerCase().includes("manager")
      )
      const designation = randomPick(
         designationPool.length > 0 ? designationPool : designations[dept]
      )

      const managerIndex = 9 + Math.floor(Math.random() * 8)
      const status = randomPick(statuses)

      emps.push({
         firstName,
         lastName,
         email,
         department: dept,
         designation,
         salary: Math.floor(Math.random() * 80000) + 50000,
         joiningDate: randomDate(new Date("2020-01-01"), new Date("2025-06-01")),
         status,
         managerIndex,
      })
   }

   return emps
}

const employeesData = generateEmployees()

async function seed() {
   const PASSWORD_HASH = await hash("password123", 10)
   console.log("Seeding database...")

   console.log("  Creating users...")
   const createdUsers = []
   for (const u of userData) {
      const [created] = await db
         .insert(users)
         .values({
            name: u.name,
            email: u.email,
            role: u.role,
            emailVerified: true,
         })
         .returning({ id: users.id })
      createdUsers.push(created)
   }

   for (let i = 0; i < createdUsers.length; i++) {
      await db.insert(accounts).values({
         userId: createdUsers[i].id,
         accountId: createdUsers[i].id,
         providerId: "credential",
         password: PASSWORD_HASH,
      })
   }

   console.log("  Creating employees...")
   const createdEmployees: { id: string; index: number }[] = []
   for (let i = 0; i < employeesData.length; i++) {
      const emp = employeesData[i]
      const [created] = await db
         .insert(employees)
         .values({
            employeeId: `EMP${String(i + 1).padStart(4, "0")}`,
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: randomPhone(),
            department: emp.department,
            designation: emp.designation,
            salary: String(emp.salary),
            joiningDate: emp.joiningDate,
            status: emp.status,
            profileImage: `https://i.pravatar.cc/150?u=${emp.email}`,
         })
         .returning({ id: employees.id })
      createdEmployees.push({ id: created.id, index: i })
   }

   for (let i = 0; i < 3; i++) {
      await db
         .update(employees)
         .set({ userId: createdUsers[i].id })
         .where(eq(employees.id, createdEmployees[i].id))
   }

   console.log("  Setting manager relationships...")
   for (let i = 0; i < employeesData.length; i++) {
      const emp = employeesData[i]
      if (emp.managerIndex !== undefined) {
         await db
            .update(employees)
            .set({ managerId: createdEmployees[emp.managerIndex].id })
            .where(eq(employees.id, createdEmployees[i].id))
      }
   }

   console.log("  Creating audit logs...")
   const actions = ["created", "updated", "manager_changed", "status_changed"] as const
   const logEntries = []

   for (let i = 0; i < 50; i++) {
      const empIndex = Math.floor(Math.random() * createdEmployees.length)
      const action = randomPick(actions)
      const meta: Record<string, unknown> = {}

      if (action === "manager_changed") {
         const newManagerIdx = Math.floor(Math.random() * 3)
         meta.previousManagerId = createdEmployees[empIndex].id
         meta.newManagerId = createdUsers[newManagerIdx].id
      } else if (action === "status_changed") {
         meta.previousStatus = "active"
         meta.newStatus = randomPick(["inactive", "terminated"])
      } else if (action === "updated") {
         meta.fields = randomPick(["salary", "designation", "phone", "department"])
      }

      logEntries.push({
         actorId: randomPick(createdUsers).id,
         action,
         entityType: "employee",
         entityId: createdEmployees[empIndex].id,
         metadata: meta,
         createdAt: randomDate(new Date("2025-01-01"), new Date()),
      })
   }

   await db.insert(auditLogs).values(logEntries)

   console.log("Seed complete!")
   console.log(`  ${createdUsers.length} users`)
   console.log(`  ${createdEmployees.length} employees`)
   console.log(`  ${logEntries.length} audit log entries`)
   console.log("")
   console.log("Login credentials:")
   console.log("  Admin:    admin@ems.dev / password123")
   console.log("  HR:       hr@ems.dev / password123")
   console.log("  Employee: employee@ems.dev / password123")
}

seed()
   .then(() => process.exit(0))
   .catch(err => {
      console.error("Seed failed:", err)
      process.exit(1)
   })
