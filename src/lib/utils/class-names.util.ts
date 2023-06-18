export function classNames(
  ...args: (string | number | undefined | null | false)[]
) {
  return args
    .filter((item) => (typeof item !== "number" ? !!item : true))
    .join(" ");
}
