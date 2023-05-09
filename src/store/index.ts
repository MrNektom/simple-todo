import { action, autorun, makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import {
  Todo,
  TodoTemporary,
  TodoWithoutId,
  createTodo,
  editTodo as patchTodo,
  getTodoList,
  isTodoTemporary,
  deleteTodo,
  TodoFilter,
  toFilter,
} from "../api/todo";

export class Store {
  filter: TodoFilter = "all";
  list: (Todo | TodoTemporary)[] = [];

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      action(() => {
        this.filter = toFilter(
          new URLSearchParams(location.search).get("filter")
        );
      })();
      this.loadTodos();
    });
  }

  async loadTodos() {
    if (globalThis.constructor.name !== "Window") return;
    const todos = await getTodoList(this.filter);
    if (typeof todos == "string") {
      if (
        ["/auth/login", "/auth/register"].reduce(
          (acc, l) => acc || location.pathname.startsWith(l),
          false
        )
      ) {
        return;
      }
      if (
        todos ==
        "Private resource access: entity must have a reference to the owner id"
      )
        return;
      return (location.href = "/auth/login");
    }

    action(() => {
      this.list = todos;
    })();
  }

  async addTodo(todo: TodoWithoutId) {
    const id = this.list.reduce(
      (id, t) => (isTodoTemporary(t) ? Math.max(id, t.tmpId) : id),
      0
    );
    const withCreating: TodoTemporary = { ...todo, creating: true, tmpId: id };
    action("push temporary", () => {
      this.list.push(withCreating);
    })();
    const r = await createTodo(todo);
    const index = this.list.findIndex((t) =>
      isTodoTemporary(t) ? t.tmpId === id : false
    );
    if (r.ok) {
      const json: Todo = await r.json();
      action("replace temporary", async () => {
        this.list.splice(index, 1, json);
      })();
    } else {
      action("delete temporary", async () => {
        this.list.splice(index, 1);
      })();
    }
  }

  async editTodo(todo: Todo) {
    const result = await patchTodo(todo);
    if (!result.ok) return;
    const newTodo = await result.json();
    const index = this.list.findIndex((t) => t.id == todo.id);
    if (index == -1) return;
    action(() => {
      this.list.splice(index, 1, newTodo);
    })();
  }

  async deleteTodo(todo: Todo) {
    const result = await deleteTodo(todo);
    if (!result.ok) return;
    const index = this.list.findIndex((t) => t.id == todo.id);
    if (index == -1) return;
    action(() => {
      this.list.splice(index, 1);
    })();
  }
}

export const makeStore = () => {
  return new Store();
};

export const storeContext = createContext(makeStore());

export const useStore = () => {
  return useContext(storeContext);
};
