export function removeEmptyFields<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== '' &&
        !(typeof value === 'number' && isNaN(value))
    )
  ) as Partial<T>;
}
