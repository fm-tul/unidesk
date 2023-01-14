import { httpClient } from "@core/init";
import { EnKeys, LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisLookupDto } from "@models/ThesisLookupDto";
import { ThesisTypeDto } from "@models/ThesisTypeDto";
import { useSingleQuery } from "hooks/useFetch";
import { IdRenderer } from "models/cellRenderers/IdRenderer";
import { MetadataRenderer } from "models/cellRenderers/MetadataRenderer";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { ThesisTypeRendererFactory } from "models/cellRenderers/ThesisTypeRenderer";
import { useMemo, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { link_pageKeywordDetail, link_pageUserDetail } from "routes/links";
import { Button } from "ui/Button";
import { classnames } from "ui/shared";
import { ColumnDefinition, ItemList, ItemListProps } from "ui/Table";

interface ThesisRendererProps {
  typeFactory: (params: ThesisLookupDto | ThesisDto) => JSX.Element;
  language: LanguagesId;
  translate: (value: EnKeys, ...args: any[]) => string;
}
export const ThesisRendererFactory = (props: ThesisRendererProps) => {
  const { typeFactory, language, translate } = props;

  const renderItem = (i: ThesisLookupDto) => {
    return (
      <div
        key={i.id}
        className={classnames(
          "status-gradient-bg grid grid-cols-[90px_1fr_240px] items-baseline py-3 px-2",
          `status-${i.status.toLowerCase()}-color`
        )}
      >
        {/* row 1 - id(or tags), name, type */}
        <span>{IdRenderer(i)}</span>
        <span>{language === "cze" ? i.nameCze : i.nameEng}</span>
        <div className="col-start-3 row-span-5">
          {MetadataRenderer(i, language)}
          <span className="pill success text-md rounded-md font-medium">{typeFactory(i)}</span>
          <div className="flow flex-wrap">
            {i.keywords
              .filter(j => j.locale === language)
              .map(i => (
                <Link key={i.id} className="pill info clickable text-xs" to={link_pageKeywordDetail.navigate(i.id)}>
                  {i.value}
                </Link>
              ))}
          </div>
        </div>

        {/* row 2 - abstract */}
        <span className={classnames("thesis-status", `status-${i.status.toLowerCase()}`)}>{renderThesisStatus(i.status, language)}</span>
        <span className="text-sm text-gray-600">
          {(language === "cze" ? i.abstractCze : i.abstractEng) || (
            <span className="row-span-full italic text-gray-400">{translate("abstract-missing")}</span>
          )}
          <div className="mt-0.5">&nbsp;</div>
        </span>

        {/* row 3 - authors */}
        <span className="px-1 text-xs">{translate("authors")}</span>
        <span className="flow text-sm text-gray-600">
          {i.authors.map(a => (
            <Button component={Link} text sm color="neutral" key={a.user.id} to={link_pageUserDetail.navigate(a.user.id)}>
              {a.user.fullName}
            </Button>
          ))}
        </span>

        {/* row 4 - supervisors */}
        {i.supervisors.length > 0 && (
          <>
            <span className="px-1 text-xs">{translate("supervisors")}</span>
            <span className="flow text-sm text-gray-600">
              {i.supervisors.map(a => (
                <Button component={Link} text sm color="neutral" key={a.user.id} to={link_pageUserDetail.navigate(a.user.id)}>
                  {a.user.fullName}
                </Button>
              ))}
            </span>
          </>
        )}

        {/* row 5 - opponents */}
        {i.opponents.length > 0 && (
          <>
            <span className="px-1 text-xs">{translate("opponents")}</span>
            <span className="flow text-sm text-gray-600">
              {i.opponents.map(a => (
                <Button component={Link} text sm color="neutral" key={a.user.id} to={link_pageUserDetail.navigate(a.user.id)}>
                  {a.user.fullName}
                </Button>
              ))}
            </span>
          </>
        )}
      </div>
    );
  };

  const columns: ColumnDefinition<ThesisLookupDto>[] = [
    { id: "id", headerName: "ID", field: IdRenderer, style: { width: 90 } },
    { id: "status", headerName: "Status", field: "status", style: { width: 90 } },
    {
      id: "name",
      headerName: "Title",
      field: language === "cze" ? "nameCze" : "nameEng",
      sortFunc: (a, b) => (language === "cze" ? a.nameCze.localeCompare(b.nameCze) : a.nameEng.localeCompare(b.nameEng)),
    },
    {
      id: "authors",
      headerName: "Authors",
      field: (row: ThesisLookupDto) => row.authors.map(a => a.user.fullName).join(", "),
      sortFunc: (a, b) =>
        a.authors
          .map(a => a.user.fullName)
          .join(", ")
          .localeCompare(b.authors.map(a => a.user.fullName).join(", ")),
    },
    {
      id: "modified",
      headerName: "Modified Date",
      field: "modified",
    },
  ];

  return { renderItem, columns };
};

interface ThesisListRendererProps extends ItemListProps<ThesisLookupDto> {
  rows: ThesisLookupDto[];
  onEvent?: (type: string, payload: ThesisLookupDto) => void;
}
export const ThesisListRenderer = (props: Omit<ThesisListRendererProps, "columns" | "renderItem">) => {
  const { rows, listClassName = "gap-1", clientSort = true, ...rest } = props;
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);
  const { data, loadData } = useSingleQuery<ThesisTypeDto[]>([]);
  const typeFactory = useMemo(() => ThesisTypeRendererFactory(data), [data]);
  const { renderItem, columns } = useMemo(() => ThesisRendererFactory({ translate, language, typeFactory }), [language, typeFactory]);

  useEffect(() => {
    loadData(httpClient.enums.thesisTypeGetAll());
  }, []);

  return <ItemList {...rest} renderItem={renderItem} columns={columns} rows={rows} listClassName={listClassName} clientSort={clientSort} />;
};
