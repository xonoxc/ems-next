export class DashboardApiError extends Error {
   constructor(
      public status: number,
      message: string
   ) {
      super(message)
      this.name = "DashboardApiError"
   }
}

async function handleResponse<T>(response: Response): Promise<T> {
   if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new DashboardApiError(response.status, body.error ?? "Unknown error")
   }
   return response.json()
}

export const DashboardApiClient = {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   async getSummary(): Promise<any> {
      const response = await fetch("/api/dashboard/summary")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return handleResponse<any>(response)
   },
}
