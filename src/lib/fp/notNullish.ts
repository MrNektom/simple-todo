export const notNullish = <T, R>(
  v: T,
  f: (v: NonNullable<T>) => R
): R | null => {
    if (v === null || v === undefined) {
        return null
    }

    return f(v)
};

