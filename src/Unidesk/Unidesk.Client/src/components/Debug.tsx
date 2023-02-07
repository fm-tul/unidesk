import { IS_DEV } from "@core/config";
import { prettyPrintJson } from "pretty-print-json";
import ReactDOM from "react-dom";

interface DebugProps {
  value: any;
  title?: string;
  noRoot?: boolean;
  show?: boolean;
}
export const Debug = (props: DebugProps) => {
  const { value, title = "Debug", noRoot = false, show=false } = props;
  const debugRoot = document.getElementById("debug-root");
  if (!IS_DEV || !show) {
    return null;
  }

  const jsonHtml = prettyPrintJson.toHtml(value, { indent: 2 });
  const consoleLogData = () => {
    console.log(value);
  };

  const result = (
    <div>
      <h3 className="cursor-pointer text-lg font-bold" onClick={consoleLogData}>
        {title}
      </h3>
      <pre className="json-container text-xs" dangerouslySetInnerHTML={{ __html: jsonHtml }} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );

  if (debugRoot && !noRoot) {
    return ReactDOM.createPortal(result, debugRoot!);
  }

  return result;
};
