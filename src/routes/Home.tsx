import {
  AddFontIcon,
  CloseFontIcon,
  EditFontIcon,
  FilterListFontIcon,
} from "@react-md/material-icons";

import React, { useContext, useEffect, useState } from "react";

import Row from "../lib/components/Row";
import Column from "../lib/components/Column";

import s from "./Home.module.scss";
import { observer } from "mobx-react";
import { Store, useStore } from "../store";
import {
  Todo,
  TodoFilter,
  TodoTemporary,
  isTodoTemporary,
  toFilter,
} from "../api/todo";
import IconButton from "../lib/components/IconButton";
import { classes } from "../lib/classes";
import { action } from "mobx";
import { useSearchParams } from "react-router-dom";

export default () => {
  const store = useStore();

  return (
    <div className={s.home}>
      <Column gap={8}>
        <Row padding="0 8px 0 0">
          <h1 style={{ flex: "auto" }}>My tasks</h1>
          <TaskFilterController />
        </Row>
        <TaskCreator store={store} />
        <TodoList store={store} />
      </Column>
    </div>
  );
};

function TaskCreator({ store }: { store: Store }) {
  const [focused, setFocused] = useState(false);
  const [title, setTitle] = useState("");

  function onFocus() {
    setFocused(true);
  }

  function onBlur() {
    if (title.length == 0) {
      setFocused(false);
    }
  }

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    store.addTodo({ name: title, complete: false });
    e.preventDefault();
  }

  return (
    <div
      className={s["task-creator"]}
      tabIndex={0}
      onClick={onFocus}
      onFocus={onFocus}
    >
      <form onSubmit={onSubmit}>
        <Row gap={8}>
          {focused ? (
            <>
              <EditFontIcon iconClassName="material-icons-outlined" />
              <input
                className={`${s["task-creator__input"]} flex1`}
                autoFocus
                type="text"
                value={title}
                onInput={onInput}
                onBlur={onBlur}
              />
            </>
          ) : (
            <>
              <AddFontIcon iconClassName="material-icons-outlined" />
              <span>Create todo</span>
            </>
          )}
        </Row>
        <input type="submit" value="" style={{ display: "none" }} />
      </form>
    </div>
  );
}

interface TodoListProps {
  store: Store;
}
const TodoList = observer(({ store: { list } }: TodoListProps) => {
  return (
    <Column gap={8}>
      {list.map((todo, i) => (
        <TodoView
          key={
            todo.id ?? ((isTodoTemporary(todo) && `tmp:${todo.tmpId}`) || "")
          }
          todo={todo}
        />
      ))}
    </Column>
  );
});

interface TodoViewProps {
  todo: TodoTemporary | Todo;
}
const TodoView = ({ todo }: TodoViewProps) => {
  const [expanded, setExpanded] = useState(false);
  const store = useStore();
  const creating = isTodoTemporary(todo) && todo.creating == true;
  const complete = !!todo.complete;

  function onToggleComplete(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (isTodoTemporary(todo)) return;
    store.editTodo({ ...todo, complete: !complete });
  }

  function onDelete(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (isTodoTemporary(todo)) return;
    store.deleteTodo(todo);
  }
  function onToggleExpanded() {
    setExpanded(!expanded);
  }
  return (
    <div
      className={s["todo-view"]}
      style={{ opacity: creating ? 0.5 : 1 }}
      onClick={onToggleExpanded}
    >
      <Column gap={8}>
        <Row gap={8}>
          <IconButton onClick={onToggleComplete}>
            <input type="checkbox" tabIndex={-1} checked={complete} readOnly />
          </IconButton>
          <Column expandedFlex>
            <span>{todo.name}</span>
            {todo.description && <span>{todo.description}</span>}
          </Column>
          <IconButton onClick={onDelete}>
            <CloseFontIcon iconClassName="material-icons-outlined" />
          </IconButton>
        </Row>
        {/* {!isTodoTemporary(todo) && expanded && <TodoViewEditMenu todo={todo} />} */}
      </Column>
    </div>
  );
};

// const TodoViewEditMenu = observer(({ todo }: { todo: Todo }) => {
//   const [name, setName] = useState(todo.name);
//   const [description, setDescription] = useState(todo.description ?? "");
//   // const [name, setName] = useState(todo.name)
//   return (
//     <div
//       className={s["todo-view__edit-menu"]}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <form className={s["todo-view__edit-menu__form"]}>
//         <label htmlFor="name">Name:</label>
//         <input
//           type="text"
//           id="name"
//           value={name}
//           onInput={(e) => setName(e.currentTarget.value)}
//         />
//         <label htmlFor="description">Description:</label>
//         <input
//           type="text"
//           id="description"
//           value={description}
//           onInput={(e) => setDescription(e.currentTarget.value)}
//         />
//         {/* <input type="text" value={name} onInput={(e) => setName(e.currentTarget.value)} /> */}
//         {/* <input type="text" value={name} onInput={(e) => setName(e.currentTarget.value)} /> */}
//       </form>
//       <div>
//         <button>Save</button>
//       </div>
//     </div>
//   );
// });

const TaskFilterController = observer(() => {
  const isServer = typeof window != "object";
  const [searchParams, setSearchParams] = useSearchParams(
    isServer ? "filter=all" : location.search
  );
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<TodoFilter>(
    toFilter(searchParams.get("filter") ?? "all")
  );
  const store = useStore();

  const onSelect = (filter: TodoFilter)=> action(() => {
      store.filter = filter;
      setSearchParams({ filter });
      setSelected(filter);
  });
  return (
    <div>
      <Row gap={8}>
        {expanded && (
          <div>
            <SelectButton
              onSelect={onSelect("done")}
              selected={selected == "done"}
              label="done"
            />
            <SelectButton
              onSelect={onSelect("undone")}
              selected={selected == "undone"}
              label="undone"
            />
            <SelectButton
              onSelect={onSelect("all")}
              selected={selected == "all"}
              label="all"
            />
          </div>
        )}
        <IconButton onClick={() => setExpanded(!expanded)}>
          <FilterListFontIcon iconClassName="material-icons-outlined" />
        </IconButton>
      </Row>
    </div>
  );
});

const SelectButton = ({
  selected = false,
  onSelect,
  label,
}: {
  selected?: boolean;
  onSelect?: () => void;
  label: TodoFilter;
}) => {
  return (
    <button
      className={classes({
        [s["select-button"]]: true,
        [s["selected"]]: selected,
      })}
      onClick={onSelect}
    >
      {label}
    </button>
  );
};
