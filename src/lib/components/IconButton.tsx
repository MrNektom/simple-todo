import s from "./IconButton.module.scss";

interface IconButtonProps {
  children: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <div tabIndex={0} className={s["icon-button"]} onClick={onClick}>
      {children}
    </div>
  );
}

export default IconButton;
