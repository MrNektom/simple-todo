export const classes = (r: Record<string|number, boolean>): string => {
    return Object.entries(r).filter((e) => e[1]).map(([n]) => n).join(" ")
}