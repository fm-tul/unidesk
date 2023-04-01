import { InternshipStatusAll } from "@api-client/constants/InternshipStatus";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { FloatingAction } from "components/mui/FloatingAction";
import { RenderDate } from "models/cellRenderers/MetadataRenderer";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import moment from "moment";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { link_pageInternshipDetail } from "routes/links";
import { Table } from "ui/Table";
import { dateColumn, idColumn } from "ui/TableColumns";

export const PageInternshipList = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { translateName, translateVal, translate } = useTranslation(language);

  const query = useQuery({
    queryKey: ["internships"],
    queryFn: () =>
      httpClient.internship.find({
        requestBody: {
          paging: { page: 1, pageSize: 10 },
        },
      }),
  });

  const data = query.data?.items ?? [];

  return (
    <>
      <Table
        clientSort
        onRowClick={i => navigate(link_pageInternshipDetail.navigate(i.id))}
        EmptyContent={<div className="text-center italic text-black/20 p-8 text-xl font-extrabold select-none">{translate("internship.no-internships")}</div>}
        rows={data}
        columns={[
          idColumn,
          {
            id: "student",
            headerName: translate("internship.student"),
            field: i => renderUserLookup(i.student),
          },
          {
            id: "internshipTitle",
            headerName: translate("internship.title"),
            field: i => i.internshipTitle,
          },
          {
            id: "companyName",
            headerName: translate("internship.company-name"),
            field: i => i.companyName,
          },
          {
            id: "dates",
            headerName: translate("internship.section.dates"),
            field: i => (
              <div className="flow">
                <RenderDate date={i.startDate!} />-<RenderDate date={i.endDate!} />
              </div>
            ),
            sortFunc: (a, b) => moment(a.startDate).diff(moment(b.startDate)),
          },
          {
            id: "status",
            headerName: translate("status"),
            field: i => translateVal(InternshipStatusAll.find(j => j.value === i.status))!,
          },
          dateColumn("created", language, translate),
          dateColumn("modified", language, translate),
        ]}
      />
      <FloatingAction tooltip={translate("create")} component={Link} to={link_pageInternshipDetail.navigate("new")} />
    </>
  );
};

export default PageInternshipList;
