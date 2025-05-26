/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from 'zod';

export function formatZodErrors<T extends Record<string, any>>(
  error: ZodError
): Partial<Record<keyof T, string>> {
  const fieldErrors = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [
      key,
      messages?.[0] ?? '',
    ])
  ) as Partial<Record<keyof T, string>>;
}
