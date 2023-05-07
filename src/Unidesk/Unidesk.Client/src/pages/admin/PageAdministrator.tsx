import { DepartmentDto, FacultyDto, InMemoryOptions, SchoolYearDto, StudyProgrammeDto, ThesisOutcomeDto, ThesisTypeDto } from "@api-client";
import { httpClient } from "@core/init";
import { R } from "@locales/R";
import { Link, useParams } from "react-router-dom";

import {
  propertiesDepartmentDto,
  propertiesFacultyDto,
  propertiesSchoolYearDto,
  propertiesStudyProgrammeDto,
  propertiesThesisOutcomeDto,
  propertiesThesisTypeDto,
} from "models/dtos";
import { link_adminManageEnum } from "routes/admin/links";
import { link_stagImport } from "routes/links";
import { Button } from "ui/Button";
import { classnames } from "ui/shared";
import { toKV, toKVWithCode } from "utils/transformUtils";

import { SimpleEntityEditor } from "./SimpleEntityEditor";
import { UnideskComponent } from "components/UnideskComponent";
import { EditorPropertiesOf } from "models/typing";
import { Section } from "components/mui/Section";
import { ChangeTracker } from "./ChangeTracker";
import { useMutation, useQuery } from "react-query";
import { useContext, useState } from "react";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { Modal } from "ui/Modal";
import { ButtonGroup } from "components/FilterBar";

export const PageAdministrator = () => {
  const { enumName } = useParams();
  const [inMemoryEditorOpen, setInMemoryEditorOpen] = useState(false);

  // departments, faculties, schoolYears, thesisOutcomes, thesisTypes, studyProgrammes
  const enumsList = [
    {
      name: "Departments",
      path: "departments",
      component: (
        <SimpleEntityEditor
          key="departments"
          schema={propertiesDepartmentDto}
          getAll={() => httpClient.enums.departmentGetAll()}
          upsertOne={i => httpClient.enums.departmentUpsert({ requestBody: i as DepartmentDto })}
          deleteOne={id => httpClient.enums.departmentDelete({ id })}
          toKV={toKVWithCode}
        />
      ),
    },
    {
      name: "Faculties",
      path: "faculties",
      component: (
        <SimpleEntityEditor
          key="faculties"
          schema={propertiesFacultyDto}
          getAll={() => httpClient.enums.facultyGetAll()}
          upsertOne={i => httpClient.enums.facultyUpsert({ requestBody: i as FacultyDto })}
          deleteOne={id => httpClient.enums.facultyDelete({ id })}
          toKV={toKVWithCode}
        />
      ),
    },
    {
      name: "School Years",
      path: "school-years",
      component: (
        <SimpleEntityEditor
          key="school-years"
          schema={propertiesSchoolYearDto as EditorPropertiesOf<SchoolYearDto>}
          getAll={() => httpClient.enums.schoolYearGetAll()}
          upsertOne={i => httpClient.enums.schoolYearUpsert({ requestBody: i as SchoolYearDto })}
          deleteOne={id => httpClient.enums.schoolYearDelete({ id })}
          toKV={(i, j) => toKV(i, j, false)}
        />
      ),
    },
    {
      name: "Thesis Outcomes",
      path: "thesis-outcomes",
      component: (
        <SimpleEntityEditor
          key="thesis-outcomes"
          schema={propertiesThesisOutcomeDto}
          getAll={() => httpClient.enums.thesisOutcomeGetAll()}
          upsertOne={i => httpClient.enums.thesisOutcomeUpsert({ requestBody: i as ThesisOutcomeDto })}
          deleteOne={id => httpClient.enums.thesisOutcomeDelete({ id })}
          toKV={toKV}
        />
      ),
    },
    {
      name: "Thesis Types",
      path: "thesis-types",
      component: (
        <SimpleEntityEditor
          key="thesis-types"
          schema={propertiesThesisTypeDto}
          getAll={() => httpClient.enums.thesisTypeGetAll()}
          upsertOne={i => httpClient.enums.thesisTypeUpsert({ requestBody: i as ThesisTypeDto })}
          deleteOne={id => httpClient.enums.thesisTypeDelete({ id })}
          toKV={toKV}
        />
      ),
    },
    {
      name: "Study Programmes",
      path: "study-programmes",
      component: (
        <SimpleEntityEditor
          key="study-programmes"
          schema={propertiesStudyProgrammeDto}
          getAll={() => httpClient.enums.studyProgrammeGetAll()}
          upsertOne={i => httpClient.enums.studyProgrammeUpsert({ requestBody: i as StudyProgrammeDto })}
          deleteOne={id => httpClient.enums.studyProgrammeDelete({ id })}
          toKV={toKV}
        />
      ),
    },
    {
      name: "Change Tracker",
      path: "change-tracker",
      component: <ChangeTracker />,
    },
  ];

  const validEnum = enumsList.find(e => e.path === enumName);

  return (
    <UnideskComponent name="PageAdministrator">
      {!validEnum && <Section title="administration-menu" />}
      <div
        className={classnames(
          "grid gap-4",
          validEnum ? "mb-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]" : "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]"
        )}
      >
        {enumsList.map(i => (
          <Button key={i.name} lg outlined component={Link} to={link_adminManageEnum.navigate(i.path)}>
            <span className={classnames(validEnum ? "p-1" : "px-4 py-3")}>{i.name}</span>
          </Button>
        ))}
      </div>

      <div>
        <Section title="administration-actions" />
        <div className={classnames("grid gap-4", "mb-4 grid-cols-[repeat(auto-fit,minmax(150px,250px))]")}>
          <Button lg outlined component={Link} to={link_stagImport.path}>
            <span className={classnames("p-1")}>{R(link_stagImport.title)}</span>
          </Button>
          <Button lg outlined onClick={() => setInMemoryEditorOpen(true)}>
            <span className={classnames("p-1")}>Update In-Memory Options</span>
          </Button>
        </div>
      </div>
      {inMemoryEditorOpen && (
        <Modal open={inMemoryEditorOpen} onClose={() => setInMemoryEditorOpen(false)} width="sm" fullWidth>
          <InMemoryOptionsEditor onClose={() => setInMemoryEditorOpen(false)} />
        </Modal>
      )}
      {validEnum && <h1 className="text-xl">{R("admin-manage-x", validEnum.name)}</h1>}
      {validEnum && <>{validEnum.component}</>}
    </UnideskComponent>
  );
};

interface InMemoryOptionsEditorProps {
  onClose: () => void;
}

export const InMemoryOptionsEditor = (props: InMemoryOptionsEditorProps) => {
  const { onClose } = props;

  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [dto, setDto] = useState<InMemoryOptions | undefined>(undefined);

  const getQUery = useQuery({
    queryKey: "inMemoryOptions",
    queryFn: () => httpClient.settings.getInMemoryOptions(),
    onSuccess: setDto,
  });

  const setQuery = useMutation((dto: InMemoryOptions) => httpClient.settings.setInMemoryOptions({ requestBody: dto! }), {
    onSuccess: setDto,
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div>Disable Emails: </div>
        <input type="checkbox" checked={dto?.disableEmails} onChange={e => setDto({ ...dto!, disableEmails: e.target.checked })} />

        <ButtonGroup className="col-span-2 flex w-full justify-end" variant="text" size="sm">
          <Button onClick={onClose} warning>
            {R("close")}
          </Button>
          <Button onClick={() => setQuery.mutate(dto!)}>{translate("update")}</Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default PageAdministrator;
