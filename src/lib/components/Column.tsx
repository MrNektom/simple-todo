import { createElement } from "react";
import classes from "./Column.module.scss";
type element = JSX.Element | string | boolean | null | undefined;
interface ColumnProps {
  children?: element[] | element;
  gap?: number;
  expandedFlex?: boolean;
}

export default ({ children, gap = 0, expandedFlex = false }: ColumnProps) => {
  return (
    <div
      className={classes.column}
      style={{ gap: `${gap}px`, flex: expandedFlex ? 1 : "initial" }}
    >
      {children}
    </div>
  );
};
