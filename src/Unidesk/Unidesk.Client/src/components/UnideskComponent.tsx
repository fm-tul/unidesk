import { Debug } from "./Debug";

interface UnideskComponentProps {
  name: string;
}
export const UnideskComponent = (props: React.PropsWithChildren<UnideskComponentProps & React.HTMLAttributes<HTMLDivElement>>) => {
  const { name, children, ...rest } = props;
  return (
    <div {...rest}>
      {children}
      <Debug value={name} title="component" />
    </div>
  );
};
