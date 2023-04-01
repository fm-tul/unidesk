import { EnKeys } from "@locales/all";
import { LanguagesId } from "@locales/common";
import { CreatedRenderer } from "models/cellRenderers/MetadataRenderer";
import { MdCalendarToday } from "react-icons/md";
import { ColumnDefinition } from "./Table";
import { IdRenderer } from "models/cellRenderers/IdRenderer";
import { TrackedEntityDto } from "@api-client/index";
import { TranslateFunc } from "@locales/translationHooks";

type DateCol = keyof TrackedEntityDto & EnKeys;
export const dateColumn = (dateCol: DateCol, language: LanguagesId, translate: TranslateFunc) =>
  ({
    id: dateCol,
    field: v => CreatedRenderer(v, language),
    headerName: (
      <span className="flow">
        <MdCalendarToday /> {translate(dateCol)}
      </span>
    ),
    style: { width: 90 },
    className: "",
    sortFunc: (b, a) => {
      const aDate = new Date(a[dateCol]);
      const bDate = new Date(b[dateCol]);
      return aDate.getTime() - bDate.getTime();
    },
  } as ColumnDefinition<TrackedEntityDto>);


export const idColumn = { id: "id", field: IdRenderer, headerName: "Id", style: { width: "100px" } };
