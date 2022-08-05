import { FaSync } from "react-icons/fa";
import StagImport from "../../components/StagImport";
import { R, Translate } from "../../locales/R";

export const PageStagImport = () => {
  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <FaSync size={20} className="text-gray-300" />
        <Translate value="stag-sync" />
      </h1>
      <div className="p-1">
        <StagImport />
      </div>
    </div>
  );
};

export default PageStagImport;
