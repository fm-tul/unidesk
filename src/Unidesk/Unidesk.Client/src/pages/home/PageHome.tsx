import { Debug } from "components/Debug";
import { FloatingAction } from "components/mui/FloatingAction";
import { UnideskComponent } from "components/UnideskComponent";
import { useContext, useState } from "react";
import { SelectField } from "ui/SelectField";
import { UserContext } from "user/UserContext";

export const PageHome = () => {
  const { user: me } = useContext(UserContext);
  // const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  // const [color, setColor] = useState<"info" | "success" | "warning" | "error" | "neutral">("info");

  return (
    <UnideskComponent name="PageHome">
      <h1 className="text-xl">Homee</h1>
      <Debug value={me} />
      {/* <SelectField options={["sm", "md", "lg"]} value={size} onValue={i => setSize(i[0] as any)} />
      <SelectField options={["info", "success", "warning", "error", "neutral"]} value={color} onValue={i => setColor(i[0] as any)} /> */}
    </UnideskComponent>
  );
};
export default PageHome;
