import { ChangeDetails, ChangeState, ChangeTrackerFilter, QueryPaging } from "@api-client/index";
import { httpClient } from "@core/init";
import { FilterBar } from "components/FilterBar";
import { UnideskComponent } from "components/UnideskComponent";
import { Collapse } from "components/mui/Collapse";
import { IdRenderer } from "models/cellRenderers/IdRenderer";
import { RenderDate } from "models/cellRenderers/MetadataRenderer";
import { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";
import { Table } from "ui/Table";
import { TextField } from "ui/TextField";
import { takeFirstPart, takeLastPart } from "utils/stringUtils";
import pluralize from "pluralize";
import { Paging } from "components/Paging";

const entityTypes = [
  "Unidesk.Db.Models.DocumentContent",
  "Unidesk.Db.Models.Department",
  "Unidesk.Db.Models.UserRole",
  "Unidesk.Db.Models.Keyword",
  "Unidesk.Db.Models.Document",
  "Unidesk.Db.Models.ThesisType",
  "Unidesk.Db.Models.ThesisOutcome",
  "Unidesk.Db.Models.Team",
  "Unidesk.Db.Models.Thesis",
  "Unidesk.Db.Models.SchoolYear",
  "Unidesk.Db.Models.User",
  "Unidesk.Db.Models.ThesisEvaluation",
  "Unidesk.Db.Models.Faculty",
  "Unidesk.Db.Models.Internships.Internship",
  "Unidesk.Db.Models.StudyProgramme",
].sort();

interface ChangeTrackerProps {}
export const ChangeTracker = (props: ChangeTrackerProps) => {
  const {} = props;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<ChangeTrackerFilter>({
    paging: { page: 1, pageSize: 20 },
  });

  const { data } = useQuery({
    queryKey: ["ChangeTracker", filter],
    queryFn: () => httpClient.changeTracker.find({ requestBody: filter }),
    enabled: (!filter.entityId || filter.entityId.length === 36) && (!filter.user || filter.user.length > 3),
  });

  const items = data?.items ?? [];

  return (
    <UnideskComponent name="ChangeTracker">
      <FilterBar>
        <FormField
          as={SelectField<string>}
          options={entityTypes}
          value={filter.entity ?? undefined}
          getTitle={i => takeLastPart(i)}
          label="Entity"
          clearable
          onValue={i => setFilter({ ...filter, entity: i[0] })}
        />
        <FormField
          as={SelectField<ChangeState>}
          options={Object.values(ChangeState)}
          value={filter.state}
          getTitle={i => i}
          label="State"
          clearable
          onValue={i => setFilter({ ...filter, state: i[0] })}
        />
        <FormField
          as={TextField}
          value={filter.entityId ?? ""}
          label="EntityId"
          width="min-w-xs"
          onValue={i => setFilter({ ...filter, entityId: !i ? undefined : i.trim() })}
        />
        <FormField as={TextField} value={filter.user ?? ""} label="User" onValue={i => setFilter({ ...filter, user: i })} />
        <Button onClick={() => setDetailsOpen(!detailsOpen)}>Show Details</Button>
      </FilterBar>
      <div className="flex flex-col gap-2">
        <div className="ml-auto">
          <Paging paging={data?.paging ?? filter.paging!} onValue={i => setFilter({ ...filter, paging: i })} />
        </div>
        <Table
          rowClassName={item => {
            if (item.state === ChangeState.ADDED) {
              return "bg-green-50";
            }
            if (item.state === ChangeState.MODIFIED) {
              return "bg-yellow-50";
            }
            if (item.state === ChangeState.DELETED) {
              return "bg-red-50";
            }
            return "";
          }}
          rows={items}
          columns={[
            {
              id: "user",
              headerName: "User",
              field: i => takeFirstPart(i.user, "@"),
            },
            {
              id: "entity",
              headerName: "Entity",
              field: i => takeLastPart(i.entity),
            },
            {
              id: "entityId",
              headerName: "EntityId",
              field: i => <IdRenderer full id={i.entityId!} />,
            },
            {
              id: "state",
              headerName: "State",
              field: i => <>{i.state}</>,
            },
            {
              id: "dateTime",
              headerName: "Created",
              field: i => <RenderDate date={i.dateTime!} format="long" />,
            },
            {
              id: "details",
              headerName: "Details",
              field: i => <RenderChangeDetails details={i.details} status={i.state} isOpen={detailsOpen} />,
            },
          ]}
        />
        <div className="ml-auto">
          <Paging paging={data?.paging ?? filter.paging!} onValue={i => setFilter({ ...filter, paging: i })} />
        </div>
      </div>
    </UnideskComponent>
  );
};

interface RenderChangeDetailsProps {
  details: ChangeDetails | undefined;
  status: ChangeState;
  isOpen?: boolean;
}
const RenderChangeDetails = (props: RenderChangeDetailsProps) => {
  const { details, status, isOpen } = props;
  const items = details?.details ?? [];
  const [show, setShow] = useState(false);
  if (items.length === 0) {
    return null;
  }
  const isNew = status === ChangeState.ADDED;
  const alwaysShow = isOpen || items.length < 0;
  const propertyProperties = pluralize("property", items.length);

  return (
    <div>
      <Button onClick={() => setShow(!show)} sm text if={!alwaysShow} fullWidth>
        {isNew ? (
          <>
            {items.length} {propertyProperties} added
          </>
        ) : (
          <>
            {items.length} {propertyProperties} changed
          </>
        )}
      </Button>

      <Collapse open={show || alwaysShow}>
        {items.map(i => {
          const { property, oldValue, newValue } = i;
          if (isNew) {
            return (
              <div key={property} className="grid grid-cols-3 hocus:bg-yellow-100">
                <span>{property}</span>
                <span className="text-green-700">{renderValue(newValue)}</span>
              </div>
            );
          }
          return (
            <div key={property} className="grid grid-cols-3 hocus:bg-yellow-100">
              <span>{property}</span>
              <span className="text-rose-700">{renderValue(oldValue)}</span>
              <span className="text-green-700">{renderValue(newValue)}</span>
            </div>
          );
        })}
      </Collapse>
    </div>
  );
};

const renderValue = (value: string | null | undefined) => {
  if (value == null) {
    return <span className="text-xs italic">{"<null>"}</span>;
  }
  if (value.length > 100) {
    return <span>{value.substring(0, 100)}...</span>;
  }
  if (value === "") {
    return <span className="text-xs italic">{"<empty>"}</span>;
  }
  return value;
};
