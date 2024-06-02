import { BaseComponentProps } from "../../types";
import clsx from "clsx";

export const PanelB: React.FC<BaseComponentProps> = (props) => {
  const { className, style } = props;
  return (
    <div className={clsx(className)} style={style}>
      Panel B
    </div>
  );
};
