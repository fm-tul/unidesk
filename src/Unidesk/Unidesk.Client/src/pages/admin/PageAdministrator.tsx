import { DepartmentDto, FacultyDto, SchoolYearDto, StudyProgrammeDto, ThesisOutcomeDto, ThesisTypeDto } from "@api-client";
import { httpClient } from "@core/init";
import { R } from "@locales/R";
import { Link, useParams } from "react-router-dom";

import { propertiesDepartmentDto, propertiesFacultyDto, propertiesSchoolYearDto, propertiesStudyProgrammeDto, propertiesThesisOutcomeDto, propertiesThesisTypeDto } from "models/dtos";
import { Button } from "ui/Button";
import { classnames } from "ui/shared";
import { toKV, toKVWithCode } from "utils/transformUtils";

import { SimpleEntityEditor } from "./SimpleEntityEditor";
import { link_adminManageEnum } from "routes/admin/links";

export const PageAdministrator = () => {
  const { enumName } = useParams();
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
          schema={propertiesSchoolYearDto}
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
  ];

  const validEnum = enumsList.find(e => e.path === enumName);

  return (
    <div>
      {!validEnum && <h1 className="text-xl">{R("administration-menu")}</h1>}
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
      {validEnum && <h1 className="text-xl">{R("admin-manage-x", validEnum.name)}</h1>}
      {validEnum && <>{validEnum.component}</>}
    </div>
  );
};

export default PageAdministrator;
