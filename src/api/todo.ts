import { getToken, getUser } from "./auth";

const filterToQuery = (filter: TodoFilter) =>
  filter == "all"
    ? ""
    : filter == "done"
    ? "&complete=true"
    : "&complete=false";

export const getTodoList = (filter: TodoFilter = "all") =>
  fetch(`/api/todo?userId=${getUser()?.id}` + filterToQuery(filter), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  }).then<Todo[], string>((r) => r.json());

export const createTodo = (todo: Partial<Todo>) =>
  fetch("/api/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ ...todo, userId: getUser()?.id }),
  });

export const editTodo = (todo: Todo) =>
  fetch(`/api/todo/${todo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ ...todo }),
  });

export const deleteTodo = (todo: Todo) =>
  fetch(`/api/todo/${todo.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export interface Todo {
  id: number;
  name: string;
  description?: string | null;
  complete: boolean;
  userId: number;
}

export interface TodoTemporary extends Partial<Todo> {
  creating?: boolean;
  tmpId: number;
}

export interface TodoWithoutId
  extends Omit<TodoTemporary, "id" | "creating" | "tmpId"> {}

export function isTodoTemporary(todo: unknown): todo is TodoTemporary {
  return (
    // @ts-ignore
    typeof todo === "object" && todo != null && typeof todo.tmpId === "number"
  );
}

export type TodoFilter = "done" | "undone" | "all";


export const toFilter = (s: string | null): TodoFilter =>
  s === "all" || s === "done" || s === "undone" ? s : "all";