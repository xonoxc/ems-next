import { fromPromise, fromThrowable } from "neverthrow"

export function attempt<T, E = Error>(promise: Promise<T>) {
   return fromPromise(promise, err => err as E)
}

export function attemptSync<T, E = Error>(func: () => T) {
   return fromThrowable(func, err => err as E)()
}

export function getErrorMessage(err: unknown, fallback: string): string {
   if (err instanceof Error) return err.message
   if (typeof err === "string") return err
   return fallback
}
