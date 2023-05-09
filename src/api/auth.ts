import { notNullish } from "../lib/fp/notNullish";

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface User {
  id: number;
  email: string;
}

export async function login(email: string, password: string): Promise<boolean> {
  const r = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data: LoginResponse = await r.json();
  setUser(data);
  return r.ok;
}

export async function register(
  email: string,
  password: string,
  rest: Record<string, string | number> = {}
): Promise<boolean> {
  const r = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...rest,
      email,
      password,
    }),
  });
  const data: LoginResponse = await r.json();
  setUser(data);
  return r.ok;
}

export const getToken = (): string | null =>
  notNullish(globalThis.localStorage?.getItem("a"), (u) => JSON.parse(u))?.accessToken;

export const getUser = (): User | null =>
  notNullish(globalThis.localStorage?.getItem("a"), (u) => JSON.parse(u))?.user;
export const setUser = (token: LoginResponse) =>
  globalThis.localStorage?.setItem("a", JSON.stringify(token));
export const clearUser = () => globalThis.localStorage?.removeItem("a");
