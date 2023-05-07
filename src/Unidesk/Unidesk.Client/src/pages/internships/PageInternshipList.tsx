import { InternshipStatusAll } from "@api-client/constants/InternshipStatus";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { InternshipFilter } from "@models/InternshipFilter";
import { FloatingAction } from "components/mui/FloatingAction";
import InternshipFilterBar from "filters/InternshipFilterBar";
import { EnumsContext } from "models/EnumsContext";
import { RenderDate } from "models/cellRenderers/MetadataRenderer";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import moment from "moment";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { link_pageInternshipDetail } from "routes/links";
import { Table } from "ui/Table";
import { dateColumn, idColumn } from "ui/TableColumns";

export const PageInternshipList = () => {
  const navigate = useNavigate();
  const { enums } = useContext(EnumsContext);
  const now = new Date();
  const { language } = useContext(LanguageContext);
  const { translateVal, translate } = useTranslation(language);
  const filterModel = useState<InternshipFilter>({
    paging: { page: 1, pageSize: 100 },
    schoolYearId: enums.schoolYears.find(i => new Date(i.start) <= now && new Date(i.end) >= now)?.id,
  });

  const query = useQuery({
    queryKey: ["internships", filterModel[0]],
    queryFn: () =>
      httpClient.internship.find({
        requestBody: { 
          ...filterModel[0]
        },
      }),
  });

  const data = query.data?.items ?? [];

  return (
    <>
      <div className="flex w-full">
        <div className="ml-auto">
          <InternshipFilterBar filterModel={filterModel} pageModel={undefined as any} />
        </div>
      </div>
      <Table
        clientSort
        onRowClick={i => navigate(link_pageInternshipDetail.navigate(i.id))}
        EmptyContent={
          <div className="select-none p-8 text-center text-xl font-extrabold italic text-black/20">
            {translate("internship.no-internships")}
          </div>
        }
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
