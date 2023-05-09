import classes from "./Row.module.scss";
type element = JSX.Element | string | boolean | null | undefined;
interface RowProps {
  children?: element[] | element;
  gap?: number
  padding?: string
}

export default ({ children, gap = 0, padding }: RowProps) => {
  return <div className={classes.row} style={{gap: `${gap}px`, padding}}>{children}</div>;
};
