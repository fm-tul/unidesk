import { Grants } from "@api-client/constants/Grants";
import { InternshipStatusAll } from "@api-client/constants/InternshipStatus";
import { No, Yes, YesNoAll } from "@api-client/constants/YesNo";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { BulkEditInternshipsDto } from "@models/BulkEditInternshipsDto";
import { InternshipDto } from "@models/InternshipDto";
import { InternshipFilter } from "@models/InternshipFilter";
import { FilterBar } from "components/FilterBar";
import { FloatingAction } from "components/mui/FloatingAction";
import { RowField } from "components/mui/RowField";
import InternshipFilterBar from "filters/InternshipFilterBar";
import { EnumsContext } from "models/EnumsContext";
import { RenderDate } from "models/cellRenderers/MetadataRenderer";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import moment from "moment";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { link_pageInternshipDetail } from "routes/links";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";
import { ColumnDefinition, Table } from "ui/Table";
import { dateColumn, idColumn } from "ui/TableColumns";
import { UserContext } from "user/UserContext";

export const PageInternshipList = () => {
  const navigate = useNavigate();
  const now = new Date();
  const { user } = useContext(UserContext);
  const { enums } = useContext(EnumsContext);
  const { language } = useContext(LanguageContext);
  const { translateVal, translate } = useTranslation(language);
  const filterModel = useState<InternshipFilter>({
    paging: { page: 1, pageSize: 100 },
    schoolYearId: enums.schoolYears.find(i => new Date(i.start) <= now && new Date(i.end) >= now)?.id,
    showArchived: false,
  });
  const [bulkEdit, setBulkEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const query = useQuery({
    queryKey: ["internships", filterModel[0]],
    queryFn: () =>
      httpClient.internship.find({
        requestBody: {
          ...filterModel[0],
        },
      }),
  });

  const handleRowClick = (dto: InternshipDto) => {
    if (bulkEdit) {
      if (selectedIds.includes(dto.id)) {
        setSelectedIds(selectedIds.filter(i => i !== dto.id));
      } else {
        setSelectedIds([...selectedIds, dto.id]);
      }
    } else {
      navigate(link_pageInternshipDetail.navigate(dto.id));
    }
  };
  const bulkEditColumns: ColumnDefinition<InternshipDto>[] = bulkEdit
    ? [
        {
          id: "selected",
          headerName: translate("bulk-edit.select-all"),
          onHeaderClick: () => setSelectedIds(selectedIds.length ? [] : data.map(i => i.id)),
          field: i => (selectedIds.includes(i.id) ? "✓" : ""),
          sortable: false,
        },
      ]
    : [];

  const data = query.data?.items ?? [];

  return (
    <>
      <div className="flex w-full">
        <Button text if={user.grantIds.includes(Grants.Internship_Manage.id)} onClick={() => setBulkEdit(!bulkEdit)}>
          {translate(bulkEdit ? "bulk-edit.turn-off" : "bulk-edit.turn-on")}
        </Button>
        <div className="ml-auto">
          <InternshipFilterBar filterModel={filterModel} />
        </div>
      </div>
      {bulkEdit && (
        <BulkUpdateDialog
          selectedIds={selectedIds}
          onClose={() => {
            setBulkEdit(false);
            setSelectedIds([]);
            query.refetch();
          }}
        />
      )}
      <Table
        clientSort
        rowClassName={i => (bulkEdit && selectedIds.includes(i.id) ? "bg-blue-100" : "")}
        onRowClick={handleRowClick}
        EmptyContent={
          <div className="select-none p-8 text-center text-xl font-extrabold italic text-black/20">
            {translate("internship.no-internships")}
          </div>
        }
        rows={data}
        columns={[
          ...bulkEditColumns,
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
            id: "schoolYear",
            headerName: translate("school-year"),
            field: i => i.schoolYear ?? "",
          },
          {
            id: "status",
            headerName: translate("status"),
            field: i => translateVal(InternshipStatusAll.find(j => j.value === i.status))!,
          },
          {
            id: "isArchived",
            headerName: translate("internship.is-archived"),
            field: i => translateVal(i.isArchived ? Yes : No)!,
          },
          dateColumn("created", language, translate),
          dateColumn("modified", language, translate),
        ]}
      />
      <FloatingAction tooltip={translate("create")} component={Link} to={link_pageInternshipDetail.navigate("new")} />
    </>
  );
};

interface BulkUpdateDialogProps {
  selectedIds: string[];
  onClose: () => void;
}
const BulkUpdateDialog = (props: BulkUpdateDialogProps) => {
  const { selectedIds, onClose } = props;
  const [updateDto, setUpdateDto] = useState<BulkEditInternshipsDto>({});
  const { language } = useContext(LanguageContext);
  const { translate, translateVal } = useTranslation(language);
  const { enums } = useContext(EnumsContext);

  const updateMutation = useMutation({
    mutationFn: (updateDto: BulkEditInternshipsDto) =>
      httpClient.internship.bulkEdit({ requestBody: { ...updateDto, internshipIds: selectedIds } }),
    onSuccess: () => {
      toast.success(translate("saved"));
      onClose();
    },
  });

  return (
    <div className="m-2 rounded-lg border-2 border-dashed border-red-600/50 bg-red-50 p-2">
      <div className="flex flex-col gap-4 p-4">
        <div className="text-2xl font-bold">{translate("bulk-edit")}</div>
        <div className="grid grid-cols-1">
          {/* schoolYearId */}
          <RowField
            title="school-year"
            Field={
              <FormField
                as={SelectField<string | undefined>}
                size="sm"
                label={updateDto.schoolYearId === undefined ? translate("common.unchanged") : translate("school-year")}
                options={enums.schoolYears.map(i => i.id)}
                value={updateDto.schoolYearId ?? undefined}
                onValue={i => setUpdateDto({ ...updateDto, schoolYearId: i[0] })}
                getTitle={i => enums.schoolYears.find(j => j.id === i)?.name}
                clearable
                searchable
              />
            }
          />

          {/* isArchived */}
          <RowField
            title="internship.is-archived"
            Field={
              <FormField
                as={SelectField<boolean | undefined>}
                size="sm"
                label={updateDto.isArchived === undefined ? translate("common.unchanged") : translate("internship.is-archived")}
                options={[true, false]}
                value={updateDto.isArchived ?? undefined}
                getTitle={i => translateVal(i ? Yes : No)}
                onValue={i => setUpdateDto({ ...updateDto, isArchived: i[0] })}
                clearable
                searchable
              />
            }
          />
        </div>

        <FilterBar type="btn-group" className="ml-auto">
          <Button error onClick={onClose}>
            {translate("cancel")}
          </Button>
          <Button onConfirmedClick={() => updateMutation.mutate(updateDto)} loading={updateMutation.isLoading}>
            {translate("update")} ({selectedIds.length})
          </Button>
        </FilterBar>
      </div>
    </div>
  );
};

export default PageInternshipList;
