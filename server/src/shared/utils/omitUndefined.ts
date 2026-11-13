/** Drop keys whose value is `undefined` so partial updates never overwrite columns. */
export function omitUndefined<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

/** Map an empty string to `null` (clear the column) and keep everything else. */
export function emptyToNull<T>(value: T | '' | undefined): T | null | undefined {
  return value === '' ? null : value;
}
