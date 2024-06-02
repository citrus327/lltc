export interface StyleOverrides {
  className?: string;
  style?: React.CSSProperties;
}

export interface BaseComponentProps extends StyleOverrides {
  children?: React.ReactNode;
}
